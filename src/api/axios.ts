import { getLsValue, removeLsValue } from "@/lib";
import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    // "2|v7zlveEQ6kGfFHo5WIttqWlh7BrWtrhGoKPZsY6k682f76f7" //admin token
    "3|p0x8JQWqFyvjKJxyV7Q3INUGhvwfuDmATQTvFw32338c0e6f"; //pharmacy token
  // "4|OTi3AVBKgy70suIiT1WOAcN7Q98LXFAluWCJ9gs7bdd21723"; //warehouse token
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
