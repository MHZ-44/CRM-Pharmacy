import { post } from "@/api/mutator";
import type {
  OtpLoginRole,
  ResendOtpPayload,
  ResendOtpResponse,
} from "@/entities/Auth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const RESEND_OTP_ENDPOINTS: Record<OtpLoginRole, string> = {
  pharmacies: "/api/pharmacy/login/resend-otp",
  warehouse: "/api/warehouse/login/resend-otp",
};

export const useResendOtp = (role: OtpLoginRole) => {
  return useMutation<
    ResendOtpResponse,
    AxiosError<{ error?: string; message?: string }>,
    ResendOtpPayload
  >({
    mutationFn: (data) =>
      post<ResendOtpResponse, ResendOtpPayload>(
        RESEND_OTP_ENDPOINTS[role],
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
  });
};
