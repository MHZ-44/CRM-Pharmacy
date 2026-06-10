import { post } from "@/api/mutator";
import { setStoredRole, type Role } from "@/lib/roles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type AdminLoginPayload = {
  login: string;
  password: string;
};

export type AdminLoginResponse = {
  token: string;
  admin: {
    role: string;
  };
};

const normalizeAdminRole = (role: string): Role => {
  return role === "super_admin" ? "superadmin" : "admin";
};

export const useLoginA = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    AdminLoginResponse,
    AxiosError<{ error: string }>,
    AdminLoginPayload
  >({
    mutationFn: (data: AdminLoginPayload) =>
      post<AdminLoginResponse, AdminLoginPayload>(`/api/admin/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: (response) => {
      localStorage.setItem("token", response.token);
      setStoredRole(normalizeAdminRole(response.admin.role));
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  return mutation;
};
