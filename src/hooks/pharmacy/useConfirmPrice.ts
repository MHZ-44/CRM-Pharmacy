import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useConfirmPrice = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ data: string }, AxiosError<{ error: string }>>(
    {
      mutationFn: () =>
        post(
          `/api/pharmacy/sales-cart/checkout/confirm`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sCart"] });
      },
    },
  );
  return mutation;
};
