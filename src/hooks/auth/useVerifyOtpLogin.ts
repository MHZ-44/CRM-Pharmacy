import { post } from "@/api/mutator";
import type {
  OtpLoginRole,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/entities/Auth";
import { setStoredRole, type Role } from "@/lib/roles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const VERIFY_OTP_ENDPOINTS: Record<OtpLoginRole, string> = {
  pharmacies: "/api/pharmacy/login/verify-otp",
  warehouse: "/api/warehouse/login/verify-otp",
};

const normalizeRole = (role: string | undefined, fallback: OtpLoginRole): Role => {
  if (role === "warehouse" || role === "warehouse_owner") return "warehouse";
  if (role === "pharmacy" || role === "pharmacist" || role === "pharmacies") {
    return "pharmacies";
  }
  return fallback;
};

const getResponseRole = (
  response: VerifyOtpResponse,
  fallback: OtpLoginRole,
): Role => {
  return normalizeRole(
    response.role ??
      response.user?.role ??
      response.pharmacy?.role ??
      response.warehouse?.role,
    fallback,
  );
};

export const useVerifyOtpLogin = (role: OtpLoginRole) => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyOtpResponse,
    AxiosError<{ error?: string; message?: string }>,
    VerifyOtpPayload
  >({
    mutationFn: (data) =>
      post<VerifyOtpResponse, VerifyOtpPayload>(
        VERIFY_OTP_ENDPOINTS[role],
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    onSuccess: (response) => {
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      setStoredRole(getResponseRole(response, role));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
