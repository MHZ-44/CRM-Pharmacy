import { del } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useDeleteFeedback = (id: string | null | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    string
  >({
    mutationFn: () =>
      del(`/api/pharmacy/sales-invoices/${id}/feedback`, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-invoices", id] });
    },
  });

  return mutation;
};

export const useDeleteItem = useDeleteFeedback;
