import { fetcher } from "@/api/fetcher";
import type { CountByAdmin } from "@/entities/Count";
import { useQuery } from "@tanstack/react-query";

export const useGetCountPharmaciesByAdmin = () => {
  const url = "/api/admins/pharmacies-count";

  const query = useQuery<
    CountByAdmin[],
    Error,
    {
      id: number;
      name: string;
      pharmacies_count: number;
    }[]
  >({
    queryKey: ["pharmacies-by-admin"],
    queryFn: () => fetcher<CountByAdmin[]>(url),
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
