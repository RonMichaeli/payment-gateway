import axios from "axios";
import { ICreditCardService } from "../types";

const URL = "https://interview.riskxint.com/visa/api/chargeCard";

type VisaHeaders = {
    identifier: string;
};

type VisaBody = {
    fullName: string;
    number: string;
    expiration: string;
    cvv: string;
    totalAmount: number;
};

type VisaResponse = {
    chargeResult: "Success" | "Failure";
    resultReason: string;
};

const visaService: ICreditCardService<VisaHeaders, VisaBody, VisaResponse> = {
    processInputData: (inputData) => {
        return {
            fullName: inputData.fullName,
            number: inputData.creditCardNumber,
            expiration: inputData.expirationDate,
            cvv: inputData.cvv,
            totalAmount: inputData.amount
        };
    },
    charge: async (headers, body) => {
        return axios.post<VisaResponse>(URL, body, { headers });
    }
};

export default visaService;