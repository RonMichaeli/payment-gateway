import { createLogger, format, LoggerOptions, transports } from "winston";
import config from "../config";

const logLevel = config.logLevel;

const myFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp}\t${level.toUpperCase()}\t${message}`;
});

const options: LoggerOptions = {
    transports: [
        new transports.Console({
            format: format.combine(format.timestamp(), myFormat),
            level: logLevel
        }),
    ],
};

const logger = createLogger(options);

logger.debug(`Logging initialized at ${logLevel} level`);

export default logger;
