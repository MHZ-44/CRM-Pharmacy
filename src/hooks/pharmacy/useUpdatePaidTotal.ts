import { patch } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdatePaidTotal = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    { id: string; paid_total: number }
  >({
    mutationFn: (data: { id: string; paid_total: number }) =>
      patch(`/api/pharmacy/sales-invoices/${data.id}/paid-total`, data, {
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
