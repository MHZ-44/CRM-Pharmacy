import { fetcher } from "@/api/fetcher";
import type { Profile } from "@/entities/Profile";
import {
  ROLE_LABELS,
  getRoleFromAuthToken,
  getStoredRole,
  isRole,
  type Role,
} from "@/lib/roles";
import { useQuery } from "@tanstack/react-query";

type ProfileResponse = Profile & {
  pharmacy_name?: string;
  doctor_name?: string;
  doctor_email?: string;
  doctor_phone?: string;
  warehouse_name?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
};

const PROFILE_ENDPOINTS: Record<Role, string> = {
  superadmin: "/api/admin/me",
  admin: "/api/admin/me",
  pharmacies: "/api/pharmacy/me",
  warehouse: "/api/warehouse/me",
};

const getCurrentRole = () => getRoleFromAuthToken() ?? getStoredRole();

const getProfileName = (profile: ProfileResponse, role: Role) => {
  if (role === "pharmacies") {
    return profile.pharmacy_name ?? profile.doctor_name ?? profile.name;
  }

  if (role === "warehouse") {
    return profile.warehouse_name ?? profile.owner_name ?? profile.name;
  }

  return profile.name;
};

const getProfileEmail = (profile: ProfileResponse, role: Role) => {
  if (role === "pharmacies") {
    return profile.doctor_email ?? profile.email;
  }

  if (role === "warehouse") {
    return profile.owner_email ?? profile.email;
  }

  return profile.email;
};

const getProfilePhone = (profile: ProfileResponse, role: Role) => {
  if (role === "pharmacies") {
    return profile.doctor_phone ?? profile.phone;
  }

  if (role === "warehouse") {
    return profile.owner_phone ?? profile.phone;
  }

  return profile.phone;
};

export const useGetProfile = () => {
  const currentRole = getCurrentRole();
  const url = currentRole ? PROFILE_ENDPOINTS[currentRole] : null;

  const query = useQuery<
    ProfileResponse,
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
    queryKey: ["profile", currentRole],
    queryFn: () => fetcher<ProfileResponse>(url ?? ""),
    enabled: Boolean(url && currentRole),
    select: (profile) => ({
      id: profile.id,
      name: getProfileName(profile, currentRole as Role) ?? "—",
      email: getProfileEmail(profile, currentRole as Role) ?? "—",
      phone: getProfilePhone(profile, currentRole as Role) ?? "—",
      role: isRole(profile.role)
        ? ROLE_LABELS[profile.role]
        : ROLE_LABELS[currentRole as Role],
      regionName: profile.region?.name ?? "—",
    }),
  });

  return query;
};
