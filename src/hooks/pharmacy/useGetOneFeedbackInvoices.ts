import { fetcher } from "@/api/fetcher";
import type { SalesInvoice } from "@/entities/Invoices";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export const useGetOneFeedbackInvoices = (id: string | null | undefined) => {
  const url = `api/pharmacy/sales-invoices/${id}`;

  const query = useQuery<
    SalesInvoice[],
    Error,
    {
      id: number;
      total_price: string;
      paid_total: string;
      discount_percent: string;
      totalQuantity: number;
      created_date: string;
      quantity: number;
      unit_price: string;
      line_total: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
      feedback: string;
    }[]
  >({
    queryKey: ["sCart"],
    queryFn: () => fetcher<SalesInvoice[]>(url),
    select: (response) => {
      const salesInvoices = Array.isArray(response)
        ? response
        : response
          ? [response]
          : [];

      return salesInvoices.flatMap((invoice) => {
        const items = Array.isArray(invoice.items)
          ? invoice.items
          : invoice.items
            ? [invoice.items]
            : [];
        const totalQuantity = items.reduce(
          (sum, item) => sum + (item?.quantity ?? 0),
          0,
        );
        const summary = {
          id: invoice.id,
          total_price: invoice.total_price,
          paid_total: invoice.paid_total,
          discount_percent: invoice.discount_percent,
          totalQuantity,
          feedback: invoice.feedback,
          created_date: dayjs(invoice.created_at).format("YYYY-MM-DD"),
        };

        if (items.length === 0) {
          return [
            {
              ...summary,
              quantity: 0,
              unit_price: "",
              line_total: "",
              name: "",
              strength: "",
              company_name: "",
              form: "",
              feedback: "",
            },
          ];
        }

        return items.map((item) => ({
          ...summary,
          quantity: item?.quantity ?? 0,
          unit_price: item?.unit_price ?? "",
          line_total: item?.line_total ?? "",
          name: item?.product?.name ?? "",
          strength: item?.product?.strength ?? "",
          company_name: item?.product?.company_name ?? "",
          form: item?.product?.form ?? "",
          feedback: invoice.feedback ?? "",
        }));
      });
    },
  });

  return query;
};
