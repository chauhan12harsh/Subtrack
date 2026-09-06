import axios from "axios";

export const ApiClient = axios.create({
  baseURL: "https://localhost:7136/",
});

ApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});