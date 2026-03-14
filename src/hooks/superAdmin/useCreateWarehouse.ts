import { post } from "@/api/mutator";
import type { Warehouse } from "@/entities/Warehouse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    Warehouse & { password: string }
  >({
    mutationFn: (data: Warehouse & { password: string }) =>
      post(`/api/warehouses`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });

  return mutation;
};
