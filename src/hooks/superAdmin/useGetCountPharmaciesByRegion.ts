import { fetcher } from "@/api/fetcher";
import type { CountByRegion } from "@/entities/Count";
import { useQuery } from "@tanstack/react-query";

export const useGetCountPharmaciesByRegion = () => {
  const url = "/api/regions/pharmacies-count";

  const query = useQuery<
    CountByRegion[],
    Error,
    {
      id: number;
      name: string;
      pharmacies_count: number;
    }[]
  >({
    queryKey: ["pharmacies-by-region"],
    queryFn: () => fetcher<CountByRegion[]>(url),
    select: (response) => {
      const Count = Array.isArray(response) ? response : (response ?? []);

      return Count.map((count) => ({
        id: count.id,
        name: count.name,
        pharmacies_count: count.pharmacies_count,
      }));
    },
  });

  return query;
};
