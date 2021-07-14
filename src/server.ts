import app from "./app";
import logger from "./util/logger";

const config = app.get("config");

/**
 * Start Express server.
 */

const server = app.listen(config.port, () => logger.info(`App is listening on port ${config.port}`));

export default server;
