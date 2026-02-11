import { fetcher } from "@/api/fetcher";
import type { CountByRegion } from "@/entities/Count";
import { useQuery } from "@tanstack/react-query";

export const useGetCountAdminsByRegion = () => {
  const url = "/api/regions/admins-count";

  const query = useQuery<
    CountByRegion[],
    Error,
    {
      id: number;
      name: string;
      admins_count: number;
    }[]
  >({
    queryKey: ["admins-by-region"],
    queryFn: () => fetcher<CountByRegion[]>(url),
    select: (response) => {
      const Count = Array.isArray(response) ? response : (response ?? []);

      return Count.map((count) => ({
        id: count.id,
        name: count.name,
        admins_count: count.admins_count,
      }));
    },
  });

  return query;
};
