import { ApiClient } from "./BaseApi";
import type { subscription } from "../Types/subscription"

export const subscriptionService = {
    
    create: async (data: subscription) => {
        const response = await ApiClient.post("/subscription/create", data);

        return response.data;
    },

    updateSubscription: async (data: subscription, subscriptionId:string) => {
        const response = await ApiClient.patch(`/subscription/update/${subscriptionId}`, data);
        
        return response.data;
    },
    
    pauseSubscription: async (subscriptionId:string) => {
        const response = await ApiClient.put(`/subscription/status/${subscriptionId}/Paused`);

        return response.data;
    },

    activateSubscription: async (subscriptionId:string) => {
        const response = await ApiClient.put(`/subscription/status/${subscriptionId}/Active`);

        return response.data;
    },

    cancelSubscription: async (subscriptionId:string) => {
        const response = await ApiClient.put(`/subscription/status/${subscriptionId}/Cancelled`);
        
        return response.data;
    },
    
    userSubscriptions: async () => {
        const response = await ApiClient.get("/subscription/user-subscription");
        
        return response.data;
    },
    
    all: async () => {
        const response = await ApiClient.get("/subscription/all");

        return response.data;
    },

    getSubscriptionCategories: async () => {
        const response = await ApiClient.get("/subscription/categories");

        return response.data;
    },
    
    getSubscriptions: async (subscriptionId: string) => {
        const response = await ApiClient.get(`/subscription/${subscriptionId}`);
        
        return response.data;
    },

    deleteSubscriptions: async (subscriptionId: string) => {
        const response = await ApiClient.delete(`/subscription/${subscriptionId}`);

        return response.data;
    },
};