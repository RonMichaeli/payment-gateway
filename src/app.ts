import express from "express";
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express-serve-static-core";
import helmet from "helmet";
import healthcheckRoute from "./routes/healthcheck.route";
import chargeRoute from "./routes/charge.route";
import chargeStatusesRouter from "./routes/chargeStatus.route";
import config from "./config";
import logger from "./util/logger";
import { initChargeStatusCache } from "./util/cache";

// Create Express server
const app = express();
app.set("config", config);

// Express configuration
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.use("/healthcheck", healthcheckRoute);
app.use("/api/charge", chargeRoute);
app.use("/api/chargeStatuses", chargeStatusesRouter);

class ResponseError extends Error {
    status?: number;
}

app.use((req: Request, res: Response, next: NextFunction) => {
    let err = new ResponseError("Page Not Found");
    err.status = 404;
    next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const error = !err.message ? new ResponseError(err) : err;

    if (!error.status) {
        error.message = "Internal Server Error";
        error.status = 500;
    }

    logger.error(error.message);

    res.status(error.status).send(error.message);
});

initChargeStatusCache();

export default app;
