import { fetcher } from "@/api/fetcher";
import type { Profile } from "@/entities/Profile";
import { ROLES } from "@/lib/role";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = () => {
  const url = "/api/admin/me";
  const query = useQuery<
    Profile,
    Error,
    {
      id: number;
      name: string;
      email: string;
      phone: string;
      role: string;
      regionName: string;
    }
  >({
    queryKey: ["profile"],
    queryFn: () => fetcher<Profile>(url),
    select: (profile) => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role:
        ROLES.find((role) => role.value === profile.role)?.label ??
        profile.role,
      regionName: profile.region.name,
    }),
  });

  return query;
};
