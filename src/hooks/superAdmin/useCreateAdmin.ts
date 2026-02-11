import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type CreateAdminPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
  region_id: string;
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    CreateAdminPayload
  >({
    mutationFn: (data: CreateAdminPayload) =>
      post(`/api/admin/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
  return mutation;
};
