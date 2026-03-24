import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreatePrice = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    { paid_total: number }
  >({
    mutationFn: (data: { paid_total: number }) =>
      post(`/api/pharmacy/sales-cart/checkout`, data, {
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
