import { fetcher } from "@/api/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

type SalesItemDto = {
  barcode?: string;
  name?: string;
  strength?: string;
  company_name?: string;
  form?: string;
  quantity?: number;
  default_unit_price?: number;
  line_total?: number;
};

type SalesEntryDto = {
  cart_id?: number;
  items?: unknown;
  item?: unknown;
  cart_items?: unknown;
  total?: number;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const getSourceEntries = (response: unknown): unknown[] => {
  if (Array.isArray(response)) return response;
  const data = (response as { data?: unknown })?.data;
  if (Array.isArray(data)) return data;
  if (data) return [data];
  return response ? [response] : [];
};

export const useGetSalesCart = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/pharmacy/sales-cart?${paramsString}`
    : "/api/pharmacy/sales-cart";

  const query = useQuery<
    unknown,
    Error,
    {
      cart_id: number;
      barcode: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
      quantity: number;
      default_unit_price: number;
      line_total: number;
      total: number;
    }[]
  >({
    queryKey: ["sCart", paramsString],
    queryFn: () => fetcher<unknown>(url),
    select: (response) => {
      const source = getSourceEntries(response);

      return source.flatMap((entry) => {
        const cartEntry = entry as SalesEntryDto;
        const rawItems =
          cartEntry.items ?? cartEntry.item ?? cartEntry.cart_items;
        const items = Array.isArray(rawItems)
          ? rawItems
          : rawItems
            ? [rawItems]
            : [];

        return items
          .map((rawItem) => {
            const item = rawItem as SalesItemDto;
            const cartId = toNumber(cartEntry.cart_id);
            const quantity = toNumber(item.quantity) ?? 0;
            const unitPrice = toNumber(item.default_unit_price) ?? 0;
            const lineTotal = toNumber(item.line_total) ?? 0;
            const total = toNumber(cartEntry.total) ?? 0;

            if (
              cartId === null ||
              typeof item.barcode !== "string" ||
              typeof item.name !== "string"
            ) {
              return null;
            }

            return {
              cart_id: cartId,
              barcode: item.barcode,
              name: item.name,
              strength: item.strength ?? "",
              company_name: item.company_name ?? "",
              form: item.form ?? "",
              quantity,
              default_unit_price: unitPrice,
              line_total: lineTotal,
              total,
            };
          })
          .filter(Boolean) as {
          cart_id: number;
          barcode: string;
          name: string;
          strength: string;
          company_name: string;
          form: string;
          quantity: number;
          default_unit_price: number;
          line_total: number;
          total: number;
        }[];
      });
    },
  });

  return query;
};
