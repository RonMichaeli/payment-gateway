import { Request } from "express";

export const getMerchantIdentifier = (req: Request): string => {
    return req.headers["merchant-identifier"] as string;
};