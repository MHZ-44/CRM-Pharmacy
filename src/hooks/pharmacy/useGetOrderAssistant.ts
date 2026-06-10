import { fetcher } from "@/api/fetcher";
import type { OrderAssistant } from "@/entities/OrderAssistant";
import { useQuery } from "@tanstack/react-query";

const ORDER_ASSISTANT_ENDPOINT = "/api/pharmacy/order-assistant/proposal";

export const useGetOrderAssistant = (enabled = true) => {
  const query = useQuery<OrderAssistant, Error>({
    queryKey: ["order-assistant"],
    queryFn: () => fetcher<OrderAssistant>(ORDER_ASSISTANT_ENDPOINT),
    enabled,
  });

  return query;
};
