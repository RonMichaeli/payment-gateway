import { Request, Response } from "express";
import logger from "../util/logger";

const healthcheckController = {
    get: (req: Request, res: Response) => {
        logger.info("healthcheck");
        res.json({
            status: "OK"
        });
    },
};

export default healthcheckController;
