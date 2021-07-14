import axios from "axios";
import { ICreditCardService } from "../types";

const URL = "https://interview.riskxint.com/mastercard/capture_card";

type MastercardHeaders = {
    identifier: string;
};

type MastercardBody = {
    first_name: string;
    last_name: string;
    card_number: string;
    expiration: string;
    cvv: string;
    charge_amount: number;
};

export type MastercardResponse = { decline_reason?: string; };

const mastercardService: ICreditCardService<MastercardHeaders, MastercardBody, MastercardResponse> = {
    processInputData: (inputData) => {
        const [first_name, last_name] = inputData.fullName.split(" ");
        return {
            first_name,
            last_name,
            card_number: inputData.creditCardNumber,
            expiration: inputData.expirationDate.replace("/", "-"),
            cvv: inputData.cvv,
            charge_amount: inputData.amount
        };
    },
    charge: async (headers, body) => {
        return axios.post<MastercardResponse>(URL, body, { headers });
    }
};

export default mastercardService;