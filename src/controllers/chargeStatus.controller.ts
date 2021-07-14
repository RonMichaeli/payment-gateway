import { Request, Response } from "express";
import { getMerchantIdentifier } from "../util/general";
import { getDeclinedChargesStatus } from "../util/cache";
import logger from "../util/logger";

const chargeStatusController = {
    get: async (req: Request, res: Response): Promise<void> => {
        const merchantIdentifier = getMerchantIdentifier(req);
        logger.info(`Charge statuses for merchant '${merchantIdentifier}'`);
        res.status(200).json(getDeclinedChargesStatus(merchantIdentifier));
    }
};

export default chargeStatusController;