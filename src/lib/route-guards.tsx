import { Navigate, Outlet } from "react-router-dom";
import {
  DEFAULT_ROLE,
  type Role,
  getRoleFromAuthToken,
  getStoredRole,
} from "./roles";

export function getCurrentRole(): Role {
  return getRoleFromAuthToken() ?? getStoredRole() ?? DEFAULT_ROLE;
}

export function getRoleHomePath(role: Role) {
  if (role === "warehouse") return "/warehouse/home";
  if (role === "pharmacies") return "/pharmacist/home";
  return "/home";
}

export function RequireRole({ allowed }: { allowed: Role[] }) {
  const role = getCurrentRole();

  if (!allowed.includes(role)) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return <Outlet />;
}

export function RoleHomeRedirect() {
  const role = getCurrentRole();
  return <Navigate to={getRoleHomePath(role)} replace />;
}
