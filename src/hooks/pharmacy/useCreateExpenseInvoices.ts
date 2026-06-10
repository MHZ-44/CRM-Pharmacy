import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type CreateExpenseInvoicePayload = {
  amount: string;
  created_by_name: string;
  description: string;
};

export const useCreateExpenseInvoices = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    CreateExpenseInvoicePayload
  >({
    mutationFn: (data: CreateExpenseInvoicePayload) =>
      post(`/api/pharmacy/expense-invoices`, data, {
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
