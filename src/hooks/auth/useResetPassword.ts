import { patch } from "@/api/mutator";
import type {
  AuthenticatedRole,
  ResetPasswordPayload,
} from "@/entities/Auth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const RESET_PASSWORD_ENDPOINTS: Record<AuthenticatedRole, string> = {
  admin: "/api/admin/password",
  pharmacies: "/api/pharmacy/password",
  warehouse: "/api/warehouse/password",
};

export const useResetPassword = (role: AuthenticatedRole) => {
  return useMutation<
    { message?: string },
    AxiosError<{ error?: string; message?: string }>,
    ResetPasswordPayload
  >({
    mutationFn: (data) =>
      patch<{ message?: string }, ResetPasswordPayload>(
        RESET_PASSWORD_ENDPOINTS[role],
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
  });
};
