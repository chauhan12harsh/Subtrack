import axios from "axios";

// Spring Boot defaults to port 8080. Override with VITE_API_URL when needed.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
