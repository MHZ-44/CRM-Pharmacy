import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type CreateWarehouseExpenseInvoicePayload = {
  amount: string;
  created_by_name: string;
  description: string;
};

export const useCreateExpenseInvoicesW = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    CreateWarehouseExpenseInvoicePayload
  >({
    mutationFn: (data: CreateWarehouseExpenseInvoicePayload) =>
      post(`/api/warehouse/expense-invoices`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["w-expense-invoices"] });
    },
  });
  return mutation;
};
