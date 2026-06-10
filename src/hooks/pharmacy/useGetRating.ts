import { fetcher } from "@/api/fetcher";
import { useQuery } from "@tanstack/react-query";

export interface WarehouseRating {
  warehouse_id: number;
  warehouse_name: string;
  ratings_count: number;
  rating_average: number;
}

export const useGetRating = (warehouseId: number | null | undefined) => {
  const query = useQuery<WarehouseRating, Error>({
    queryKey: ["ratings", warehouseId],
    queryFn: () =>
      fetcher<WarehouseRating>(`/api/pharmacy/warehouses/${warehouseId}/rating`),
    enabled: Boolean(warehouseId),
  });

  return query;
};
