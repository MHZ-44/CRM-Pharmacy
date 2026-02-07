import type { AxiosRequestConfig } from "axios";
import axiosInstance from "./axios";

export const fetcher = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await axiosInstance.get<T>(url, {
    ...config,
  });
  return response.data;
};
