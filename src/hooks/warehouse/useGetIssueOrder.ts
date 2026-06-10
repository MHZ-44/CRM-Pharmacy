import { fetcher } from "@/api/fetcher";
import type {
  Order as WarehouseOrderResponse,
  WarehouseOrder,
} from "@/entities/Order";
import { useQuery } from "@tanstack/react-query";

const toArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

export const normalizeWarehouseOrder = (
  order: WarehouseOrderResponse,
): WarehouseOrder => {
  const items = toArray(order.items);
  const feedbacks = toArray(order.feedbacks);

  return {
    id: order.id,
    pharmacyName: order.pharmacy?.pharmacy_name ?? "—",
    items: items.map((item) => ({
      id: item.id,
      medicineName: item.product?.name ?? "—",
      quantity: item.quantity ?? 0,
      checked: false,
      barcode: item.product?.barcode ?? "—",
      strength: item.product?.strength ?? "—",
      companyName: item.product?.company_name ?? "—",
      form: item.product?.form ?? "—",
      unitCost: item.unit_cost ?? "0",
      lineTotal: item.line_total ?? "0",
    })),
    sent: order.status !== "pending",
    status: order.status ?? "—",
    totalCost: order.total_cost ?? "0",
    regionName: order.pharmacy?.region?.name ?? "—",
    issueNote: order.issue_note ?? "—",
    createdAt: order.created_at,
    approvedAt: order.approved_at,
    rejectedAt: order.rejected_at,
    receivedAt: order.received_at,
    issueAt: order.issue_at,
    feedbacks: feedbacks.map((feedback) => ({
      id: feedback.id,
      content: feedback.content ?? "",
      createdAt: feedback.created_at,
    })),
  };
};

export const useGetIssueOrders = () => {
  const query = useQuery<WarehouseOrderResponse[], Error, WarehouseOrder[]>({
    queryKey: ["orders", "issues"],
    queryFn: () =>
      fetcher<WarehouseOrderResponse[]>("/api/warehouse/orders/issues"),
    enabled: true,
    select: (response) => {
      const orders = Array.isArray(response)
        ? response
        : response
          ? [response]
          : [];
      return orders.map(normalizeWarehouseOrder);
    },
  });

  return query;
};
