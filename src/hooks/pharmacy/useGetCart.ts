import { fetcher } from "@/api/fetcher";
import { useQuery } from "@tanstack/react-query";

type CartItemDto = {
  barcode?: string;
  name?: string;
  strength?: string;
  company_name?: string;
  form?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
};

type CartEntryDto = {
  cart_id?: number;
  warehouse_id?: number;
  warehouse_name?: string;
  warehouse?: { name?: string };
  items?: unknown;
  item?: unknown;
  cart_items?: unknown;
  total?: number;
};

const url = "/api/pharmacy/order-cart";

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

const cartExistsFromEntries = (entries: unknown[]) => {
  return entries.some((entry) => {
    const cartEntry = entry as CartEntryDto;
    return (
      cartEntry.cart_id !== undefined ||
      cartEntry.warehouse_id !== undefined ||
      cartEntry.warehouse_name !== undefined ||
      cartEntry.warehouse?.name !== undefined ||
      cartEntry.items !== undefined ||
      cartEntry.item !== undefined ||
      cartEntry.cart_items !== undefined ||
      cartEntry.total !== undefined
    );
  });
};

const normalizeCartItems = (entries: unknown[]) => {
  return entries.flatMap((entry) => {
    const cartEntry = entry as CartEntryDto;

    const rawItems = cartEntry.items ?? cartEntry.item ?? cartEntry.cart_items;

    const items = Array.isArray(rawItems)
      ? rawItems
      : rawItems
        ? [rawItems]
        : [];

    return items
      .map((rawItem) => {
        const item = rawItem as CartItemDto;

        const cartId = toNumber(cartEntry.cart_id);
        const warehouseId = toNumber(cartEntry.warehouse_id);
        const quantity = toNumber(item.quantity);
        const unitPrice = toNumber(item.unit_price);
        const lineTotal = toNumber(item.line_total);
        const total = toNumber(cartEntry.total) ?? 0;
        const warehouseName =
          typeof cartEntry.warehouse_name === "string"
            ? cartEntry.warehouse_name
            : typeof cartEntry.warehouse?.name === "string"
              ? cartEntry.warehouse.name
              : null;

        if (
          cartId === null ||
          warehouseId === null ||
          warehouseName === null ||
          typeof item.barcode !== "string" ||
          typeof item.name !== "string" ||
          typeof item.strength !== "string" ||
          typeof item.company_name !== "string" ||
          typeof item.form !== "string" ||
          quantity === null ||
          unitPrice === null ||
          lineTotal === null
        ) {
          return null;
        }

        return {
          cart_id: cartId,
          warehouse_id: warehouseId,
          warehouse_name: warehouseName,
          barcode: item.barcode,
          name: item.name,
          strength: item.strength,
          company_name: item.company_name,
          form: item.form,
          quantity,
          unit_price: unitPrice,
          line_total: lineTotal,
          total,
        };
      })
      .filter(Boolean) as {
      cart_id: number;
      warehouse_id: number;
      warehouse_name: string;
      barcode: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
      quantity: number;
      unit_price: number;
      line_total: number;
      total: number;
    }[];
  });
};

export const useGetCart = () => {

  const query = useQuery<
    unknown,
    Error,
    {
      cart_id: number;
      warehouse_id: number;
      warehouse_name: string;
      barcode: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
      quantity: number;
      unit_price: number;
      line_total: number;
      total: number;
    }[]
  >({
    queryKey: ["cart"],
    queryFn: () => fetcher<unknown>(url),
    select: (response) => {
      const source = getSourceEntries(response);
      return normalizeCartItems(source);
    },
  });

  return query;
};

export const useGetCartStatus = () => {
  return useQuery<
    unknown,
    Error,
    { cartExists: boolean; hasItems: boolean }
  >({
    queryKey: ["cart", "status"],
    queryFn: () => fetcher<unknown>(url),
    select: (response) => {
      const source = getSourceEntries(response);
      const items = normalizeCartItems(source);
      return {
        cartExists: cartExistsFromEntries(source),
        hasItems: items.length > 0,
      };
    },
  });
};
