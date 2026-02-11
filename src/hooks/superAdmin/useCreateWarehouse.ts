import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type CreateWarehousePayload = {
  warehouse_name: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  password: string;
  region_id: number;
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    CreateWarehousePayload
  >({
    mutationFn: (data: CreateWarehousePayload) =>
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
