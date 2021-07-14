import logger from "./logger";

const MAX_ATTEMPTS = 4;

const wait = (interval: number) => new Promise((resolve) => setTimeout(resolve, interval));

export const retry = async (callback: () => Promise<void>, attempt = 1): Promise<void> => {
    try {
        logger.info(`Attempt #${attempt}`);
        await callback();
    } catch (error) {
        logger.info(`Attempt #${attempt} failed.\n${error}`);

        if (attempt === MAX_ATTEMPTS) {
            logger.error(`All ${MAX_ATTEMPTS} attempts have failed`);
            throw new Error(error);
        }

        const intervalSeconds = attempt ** 2;
        logger.info(`Trying again in ${intervalSeconds} seconds...`);

        await wait(intervalSeconds * 1000);
        await retry(callback, attempt + 1);
    }
};