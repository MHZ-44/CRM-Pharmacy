import type { AxiosRequestConfig, Method } from "axios";
import axiosInstance from "./axios";

export const mutator = async <T, D = unknown>(
  method: Lowercase<Method>,
  url: string,
  data?: D,
  config?: Omit<AxiosRequestConfig<D>, "method" | "url" | "data">,
): Promise<T> => {
  const response = await axiosInstance.request<T>({
    method,
    url,
    data,
    ...config,
  });
  return response.data;
};

export const post = async <T, D = unknown>(
  url: string,
  data: D,
  config?: Omit<AxiosRequestConfig<D>, "method" | "url" | "data">,
) => await mutator<T, D>("post", url, data, config);

export const patch = async <T, D = unknown>(
  url: string,
  data: D,
  config?: Omit<AxiosRequestConfig<D>, "method" | "url" | "data">,
) => await mutator<T, D>("patch", url, data, config);

export const put = async <T, D = unknown>(
  url: string,
  data: D,
  config?: Omit<AxiosRequestConfig<D>, "method" | "url" | "data">,
) => await mutator<T, D>("put", url, data, config);

export const del = async <T>(
  url: string,
  config?: Omit<AxiosRequestConfig, "method" | "url" | "data">,
) =>
  await mutator<T>("delete", url, undefined, config);
