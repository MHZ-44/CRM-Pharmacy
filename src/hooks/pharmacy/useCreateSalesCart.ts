import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreateSalesCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    { barcode: string }
  >({
    mutationFn: (data: { barcode: string }) =>
      post(`/api/pharmacy/sales-cart/items`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sCart"] });
    },
  });

  return mutation;
};

export const useCreateOrder = useCreateSalesCart;
