import { ApiClient } from "./BaseApi";

import type { LoginRequest, RegisterRequest } from "../Types/auth";

export const authService = {

  register: async (data: RegisterRequest) => {
    const response = await ApiClient.post("/auth/register", data);

    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await ApiClient.post("/auth/login", data);

    return response.data;
  }
  
};