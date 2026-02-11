import { fetcher } from "@/api/fetcher";
import type { Count } from "@/entities/Count";
import { useQuery } from "@tanstack/react-query";

export const useGetCountWarehouses = () => {
  const url = "/api/warehouses/count";

  const query = useQuery<Count, Error, number>({
    queryKey: ["warehouses-count"],
    queryFn: () => fetcher<Count>(url),
    select: (response) => {
      if (Array.isArray(response)) {
        return response[0]?.count ?? 0;
      }
      return response?.count ?? 0;
    },
  });

  return query;
};
