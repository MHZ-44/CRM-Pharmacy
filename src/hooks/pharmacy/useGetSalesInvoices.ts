import { fetcher } from "@/api/fetcher";
import type { SalesInvoice } from "@/entities/Invoices";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export const useGetSalesInvoices = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/pharmacy/sales-invoices?${paramsString}`
    : "/api/pharmacy/sales-invoices";

  const query = useQuery<
    SalesInvoice[],
    Error,
    {
      id: number;
      total_price: string;
      paid_total: string;
      discount_percent: string;
      quantity: number;
    }[]
  >({
    queryKey: ["sCart", paramsString],
    queryFn: () => fetcher<SalesInvoice[]>(url),
    select: (response) => {
      const salesInvoices = Array.isArray(response)
        ? response
        : (response ?? []);

      return salesInvoices.map((invoice) => {
        const items = Array.isArray(invoice.items)
          ? invoice.items
          : invoice.items
            ? [invoice.items]
            : [];
        const totalQuantity = items.reduce(
          (sum, item) => sum + (item?.quantity ?? 0),
          0,
        );

        return {
          id: invoice.id,
          total_price: invoice.total_price,
          paid_total: invoice.paid_total,
          discount_percent: invoice.discount_percent,
          quantity: totalQuantity,
        };
      });
    },
  });

  return query;
};
