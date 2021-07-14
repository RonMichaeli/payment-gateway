import { Request, Response } from "express";
import logger from "../util/logger";
import visaService from "../services/visa.service";
import mastercardService from "../services/mastercard.service";
import { ValidRequestBody } from "../types";
import { retry } from "../util/retry";
import { addDeclinedCharge } from "../util/cache";
import { getMerchantIdentifier } from "../util/general";

const handleCardCompanyResponse = (req: Request, res: Response, declineReason?: string): void => {
    let body = {};
    if (declineReason) {
        logger.error(`Decline reason: ${declineReason}`);
        addDeclinedCharge(getMerchantIdentifier(req), declineReason);
        body = { error: "Card declined" };
    }
    res.status(200).json(body);
};

const handleTechnicalError = (res: Response, err: Error): void => {
    logger.error(`An error occurred. ${err}`);
    res.status(500).json({});
};

const chargeController = {
    charge: async (req: Request, res: Response): Promise<void> => {
        try {
            const headers = { identifier: "Ron" };
            switch ((req.body as ValidRequestBody).creditCardCompany) {
                case "visa": {
                    return await retry(async () => {
                        logger.info("Contacting Visa...");

                        const visaBody = visaService.processInputData(req.body);
                        const visaResponse = await visaService.charge(headers, visaBody);
                        const { chargeResult, resultReason } = visaResponse.data;

                        logger.info(`Got response with status: ${chargeResult}`);

                        handleCardCompanyResponse(req, res, chargeResult === "Failure" ? resultReason : undefined);
                    });
                }

                case "mastercard": {
                    return await retry(async () => {
                        logger.info("Contacting MasterCard...");

                        const mastercardBody = mastercardService.processInputData(req.body);
                        const mastercardResponse = await mastercardService.charge(headers, mastercardBody);

                        logger.info(`Got response with status: ${mastercardResponse.status}`);

                        // for some reason I never get a response with status 400 and 'decline_reason'. Sometimes an error is thrown with the following message:
                        // "Request failed with status code 400"
                        // But since it's an error, there's no decline reason

                        handleCardCompanyResponse(req, res, mastercardResponse.status === 400 ? mastercardResponse.data.decline_reason : undefined);
                    });
                }
            }
        }
        catch (e) {
            handleTechnicalError(res, e);
        }
    }
};

export default chargeController;
