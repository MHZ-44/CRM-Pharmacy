import { patch } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateQuantitySales = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    { barcode: string; quantity: number }
  >({
    mutationFn: (data: { barcode: string; quantity: number }) =>
      patch(`/api/pharmacy/sales-cart/items/${data.barcode}`, data, {
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
