import { fetcher } from "@/api/fetcher";
import type { Admin } from "@/entities/Admin";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export const useGetAdmins = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString ? `/api/admins?${paramsString}` : "/api/admins";

  const query = useQuery<
    Admin[],
    Error,
    {
      id: number;
      name: string;
      email: string;
      phone: string;
      role: string;
      regionName: string;
    }[]
  >({
    queryKey: ["admins", paramsString],
    queryFn: () => fetcher<Admin[]>(url),
    select: (response) => {
      const admins = Array.isArray(response) ? response : (response ?? []);

      return admins.map((admin) => ({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        regionName: admin.region.name,
      }));
    },
  });

  return query;
};
