import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useConfirmPrice = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    { feedback?: string } | undefined
  >({
    mutationFn: (data) =>
      post(
        `/api/pharmacy/sales-cart/checkout/confirm`,
        data ?? {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sCart"] });
      queryClient.invalidateQueries({ queryKey: ["sales-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-invoices"] });
    },
  });
  return mutation;
};
