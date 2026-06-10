import { post } from "@/api/mutator";
import type {
  LoginPayload,
  OtpLoginResponse,
  OtpLoginRole,
} from "@/entities/Auth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const LOGIN_ENDPOINTS: Record<OtpLoginRole, string> = {
  pharmacies: "/api/pharmacy/login",
  warehouse: "/api/warehouse/login",
};

export const useOtpLogin = (role: OtpLoginRole) => {
  return useMutation<
    OtpLoginResponse,
    AxiosError<{ error?: string; message?: string }>,
    LoginPayload
  >({
    mutationFn: (data) =>
      post<OtpLoginResponse, LoginPayload>(LOGIN_ENDPOINTS[role], data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
  });
};
