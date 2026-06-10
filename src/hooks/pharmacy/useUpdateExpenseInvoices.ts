import { put } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateExpenseInvoices = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    { id: string; description: string; amount: string }
  >({
    mutationFn: (data: { id: string; description: string; amount: string }) =>
      put(`/api/pharmacy/expense-invoices/${data.id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-invoices"] });
    },
  });
  return mutation;
};
