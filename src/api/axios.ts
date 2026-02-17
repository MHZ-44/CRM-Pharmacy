import { getLsValue, removeLsValue } from "@/lib";
import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = "1|G1U9QrD0R7iQ2w7PQL0to7s8HgmenWOukW2AKDrB97d5f0eb";
  // getLsValue("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers = config.headers ?? {};
  config.headers["ngrok-skip-browser-warning"] = "true";
  config.headers["apiKey"] =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      removeLsValue("token");
      // window.location.assign("/auth/login");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
