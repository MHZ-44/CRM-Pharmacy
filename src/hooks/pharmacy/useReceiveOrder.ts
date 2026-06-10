import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useReceiveOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ data: string }, AxiosError<{ error: string }>>(
    {
      mutationFn: () =>
        post(
          `/api/pharmacy/orders/${orderId}/receive`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["order"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
    },
  );
  return mutation;
};
