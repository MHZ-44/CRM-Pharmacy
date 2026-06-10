import { fetcher } from "@/api/fetcher";
import type {
  Order as WarehouseOrderResponse,
  WarehouseOrder,
} from "@/entities/Order";
import { useQuery } from "@tanstack/react-query";
import { normalizeWarehouseOrder } from "./useGetPendingOdreds";

export const useGetOnePendingOrder = (id: number | null | undefined) => {
  const query = useQuery<WarehouseOrderResponse, Error, WarehouseOrder | null>({
    queryKey: ["orders", id],
    queryFn: () =>
      fetcher<WarehouseOrderResponse>(`/api/warehouse/orders/${id}`),
    enabled: Boolean(id),
    select: (response) => {
      const order = Array.isArray(response) ? response[0] : response;
      return order ? normalizeWarehouseOrder(order) : null;
    },
  });

  return query;
};
