import { fetcher } from "@/api/fetcher";
import type { ExpenseInvoice } from "@/entities/Invoices";
import { useQuery } from "@tanstack/react-query";

export const useGetOneExpenseInvoice = (id: number | null | undefined) => {
  const query = useQuery<
    ExpenseInvoice,
    Error,
    {
      id: number;
      created_by_name: string;
      description: string;
      amount: string;
      created_at: string;
    } | null
  >({
    queryKey: ["expense-invoices", id],
    queryFn: () =>
      fetcher<ExpenseInvoice>(`/api/pharmacy/expense-invoices/${id}`),
    enabled: Boolean(id),
    select: (response) => {
      const expenseInvoice = Array.isArray(response) ? response[0] : response;

      if (!expenseInvoice) return null;

      return {
        id: expenseInvoice.id,
        created_by_name: expenseInvoice.created_by_name,
        description: expenseInvoice.description,
        amount: expenseInvoice.amount,
        created_at: expenseInvoice.created_at,
      };
    },
  });

  return query;
};
