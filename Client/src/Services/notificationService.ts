import { ApiClient } from "./BaseApi";

// import type { Notification } from "../../Types/notification";

export const notificationService = {

    GetNotifications: async () => {
        const response = await ApiClient.get("notification/my");

        return response.data;
    },
    
    ReadAllNotifications: async () => {
        const response = await ApiClient.patch("notification/readall");
        
        return response.data;
    },

    ReadNotification: async (notificationId: string) => {
        const response = await ApiClient.patch(`notification/read/${notificationId}`);

        return response.data;
    },
    
    GetUnreadNotificationCount: async () => {
        const response = await ApiClient.get("notification/unreadcount");
        
        return response.data;
    },

    GetAllNotifications: async () => {
        const response = await ApiClient.get("notification/all");

        return response.data;
    },

    deleteSubscriptions: async (notificationId: string) => {
        const response = await ApiClient.delete(`/notification/${notificationId}`);

        return response.data;
    },

};