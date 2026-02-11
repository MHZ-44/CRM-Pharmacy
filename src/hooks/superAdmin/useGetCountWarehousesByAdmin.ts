import { fetcher } from "@/api/fetcher";
import type { CountByAdmin } from "@/entities/Count";
import { useQuery } from "@tanstack/react-query";

export const useGetCountWarehousesByAdmin = () => {
  const url = "/api/admins/warehouses-count";

  const query = useQuery<
    CountByAdmin[],
    Error,
    {
      id: number;
      name: string;
      warehouses_count: number;
    }[]
  >({
    queryKey: ["warehouses-by-admin"],
    queryFn: () => fetcher<CountByAdmin[]>(url),
    select: (response) => {
      const Count = Array.isArray(response) ? response : (response ?? []);

      return Count.map((count) => ({
        id: count.id,
        name: count.name,
        warehouses_count: count.warehouses_count,
      }));
    },
  });

  return query;
};
