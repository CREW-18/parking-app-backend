import axios from "axios";

const defaultBaseURL = "https://parking-app-backend-u019.onrender.com";
const configuredBaseURL = import.meta.env.VITE_API_BASE_URL || defaultBaseURL;
export const API_BASE_URL = configuredBaseURL.replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("The backend took too long to respond.");
    }

    return Promise.reject(error);
  }
);
