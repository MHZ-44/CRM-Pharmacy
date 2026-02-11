import { fetcher } from "@/api/fetcher";
import type { CountByRegion } from "@/entities/Count";
import { useQuery } from "@tanstack/react-query";

export const useGetCountWarehousesByRegion = () => {
  const url = "/api/regions/warehouses-count";

  const query = useQuery<
    CountByRegion[],
    Error,
    {
      id: number;
      name: string;
      warehouses_count: number;
    }[]
  >({
    queryKey: ["warehouses-by-region"],
    queryFn: () => fetcher<CountByRegion[]>(url),
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
