/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet } from "react-router-dom";
import {
  type Role,
  getRoleFromAuthToken,
  getStoredAuthToken,
  getStoredRole,
} from "./roles";

export function getCurrentRole(): Role | null {
  return getRoleFromAuthToken() ?? getStoredRole();
}

export function isAuthenticated() {
  return Boolean(getStoredAuthToken() && getCurrentRole());
}

export function getRoleHomePath(role: Role) {
  if (role === "warehouse") return "/warehouse/home";
  if (role === "pharmacies") return "/pharmacy/sales-cart";
  return "/home";
}

export function RequireRole({ allowed }: { allowed: Role[] }) {
  const role = getCurrentRole();

  if (!isAuthenticated() || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return <Outlet />;
}

export function RoleHomeRedirect() {
  const role = getCurrentRole();
  if (!isAuthenticated() || !role) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRoleHomePath(role)} replace />;
}
