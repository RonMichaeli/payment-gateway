import { AxiosResponse } from "axios";

export type ValidRequestBody = {
    fullName: string;
    creditCardNumber: string;
    creditCardCompany: "visa" | "mastercard";
    expirationDate: string;
    cvv: string;
    amount: number;
};

export type ICreditCardService<Headers, Body, Response> = {
    processInputData: (inputData: ValidRequestBody) => Body;
    charge: (headers: Headers, body: Body) => Promise<AxiosResponse<Response>>;
};