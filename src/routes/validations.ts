import { NextFunction, Request, Response } from "express";
import { getMerchantIdentifier } from "../util/general";
import logger from "../util/logger";

const validCreditCardCompanies = ["visa", "mastercard"];
const creditCardNumberRegex = /^[0-9]{16}$/;
const expirationDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
const cvvRegex = /^[0-9]{3,4}$/;

type RequestBodyValidation = {
    key: string;
    validate: (value: unknown) => string | undefined;
};

const requestBodyValidations: RequestBodyValidation[] = [
    {
        key: "fullName",
        validate: (value: unknown) => {
            if (typeof value !== "string") {
                return "property 'fullName' must be a string";
            }
        }
    },
    {
        key: "creditCardNumber",
        validate: (value: unknown) => {
            if (typeof value !== "string") {
                return "property 'creditCardNumber' must be a string";
            }
            if (!creditCardNumberRegex.test(value)) {
                return "credit card number must be 16 digits";
            }
        }
    },
    {
        key: "creditCardCompany",
        validate: (value: unknown) => {
            if (!validCreditCardCompanies.includes(value as string)) {
                return `property 'creditCardCompany' must be one of [${validCreditCardCompanies.join(", ")}]`;
            }
        }
    },
    {
        key: "expirationDate",
        validate: (value: unknown) => {
            if (typeof value !== "string") {
                return "property 'expirationDate' must be a string";
            }
            if (!expirationDateRegex.test(value)) {
                return "property 'expirationDate' must be formatted as 'MM/YY'";
            }
        }
    },
    {
        key: "cvv",
        validate: (value: unknown) => {
            if (typeof value !== "string") {
                return "property 'cvv' must be a string";
            }
            if (!cvvRegex.test(value)) {
                return "property 'cvv' must be 3 or 4 digits";
            }
        }
    },
    {
        key: "amount",
        validate: (value: unknown) => {
            if (typeof value !== "number") {
                return "property 'amount' must be a number";
            }
        }
    },
];

const handleInvalidRequest = (res: Response, errorMessage: string): void => {
    logger.error(errorMessage);
    res.status(400).json({});
};

export const validateHeaders = (req: Request, res: Response, next: NextFunction): void => {
    logger.info("Validating request headers...");

    if (!getMerchantIdentifier(req)) {
        return handleInvalidRequest(res, "missing merchant identifier header");
    }

    logger.info("Request headers are valid");
    next();
};

export const validateChargePayload = (req: Request, res: Response, next: NextFunction): void => {
    logger.info("Validating charge request payload...");

    for (const requestBodyValidation of requestBodyValidations) {
        const value = req.body[requestBodyValidation.key];
        if (!value) {
            return handleInvalidRequest(res, `request body has no '${requestBodyValidation.key}' property`);
        }
        const errorMessage = requestBodyValidation.validate(value);
        if (errorMessage) {
            return handleInvalidRequest(res, errorMessage);
        }
    }

    logger.info("Charge request payload is valid");
    next();
};