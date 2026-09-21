import type { ChangePasswordRequest, UpdateUserRequest, User } from "../Types/user";
import { ApiClient } from "./BaseApi";

export const userService = {

    getCurrentUser: async ():Promise<User> => {
        const response = await ApiClient.get("/user/profile");
        
        return response.data;
    },
    updateProfile: async (data:UpdateUserRequest): Promise<User> => {
        const response = await ApiClient.patch("/user/update",data);
        
        return response.data;
    },
    changePassword: async (data:ChangePasswordRequest): Promise<void> => {
        const response = await ApiClient.patch("/user/changepassword",data);
        
        return response.data;
    }
}