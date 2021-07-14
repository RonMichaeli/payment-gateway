type ChargeStatusCache = Record<string, Record<string, number>>;

let cache: ChargeStatusCache;

export const initChargeStatusCache = (): void => {
    cache = {};
};

export const addDeclinedCharge = (merchantIdentifier: string, declineReason: string): void => {
    if (!cache[merchantIdentifier]) {
        cache[merchantIdentifier] = {};
    }
    if (!cache[merchantIdentifier][declineReason]) {
        cache[merchantIdentifier][declineReason] = 0;
    }
    cache[merchantIdentifier][declineReason]++;
};

export const getDeclinedChargesStatus = (merchantIdentifier: string) => {
    const merchantStatus = cache[merchantIdentifier];
    return Object.entries(merchantStatus || {}).map(([reason, count]) => ({ reason, count }));
};