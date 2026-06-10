import { fetcher } from "@/api/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import type { ExpenseInvoice } from "@/entities/Invoices";

export const useGetExpenseInvoicesW = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/warehouse/expense-invoices?${paramsString}`
    : "/api/warehouse/expense-invoices";
  const query = useQuery<
    ExpenseInvoice[],
    Error,
    {
      id: number;
      created_by_name: string;
      description: string;
      amount: string;
      created_at: string;
    }[]
  >({
    queryKey: ["w-expense-invoices", paramsString],
    queryFn: () => fetcher<ExpenseInvoice[]>(url),
    select: (response) => {
      const expenseInvoices = Array.isArray(response)
        ? response
        : (response ?? []);

      return expenseInvoices.map((invoice) => ({
        id: invoice.id,
        created_by_name: invoice.created_by_name,
        description: invoice.description,
        amount: invoice.amount,
        created_at: dayjs(invoice.created_at).format("YYYY-MM-DD"),
      }));
    },
  });

  return query;
};
