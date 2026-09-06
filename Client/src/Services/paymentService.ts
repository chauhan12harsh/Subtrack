import { ApiClient } from "./BaseApi";
import type { CreatePayment } from "../Types/payment";

export const paymentService = {
    
    createPayment: async (data: CreatePayment) => {
        const response = await ApiClient.post("/payment/process", data);

        return response.data;
    },

    paymentsBySubscriptionId: async (subscriptionId:string) => {
        const response = await ApiClient.get(`/payment/subscription/${subscriptionId}`);
        
        return response.data;
    },

    paymentByPaymentId: async (paymentId:string) => {
        const response = await ApiClient.get(`/payment/${paymentId}`);
        
        return response.data;
    },

    getAllUserPaymentTransactions: async () => {
        const response = await ApiClient.get("/payment/transactions");
        
        return response.data;
    },

    getAllPaymentTransactions: async () => {
        const response = await ApiClient.get("/payment/all");
        
        return response.data;
    },
    
};