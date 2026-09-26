import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:7136";

export const ApiClient = axios.create({
  baseURL: baseURL.endsWith("/") ? baseURL : `${baseURL}/`,
});

ApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
