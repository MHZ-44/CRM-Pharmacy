import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useApproveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<{ data: string }, AxiosError<{ error: string }>, number>({
    mutationFn: (orderId: number) =>
      post(
        `/api/warehouse/orders/${orderId}/approve`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", String(orderId)] });
    },
  });
};
