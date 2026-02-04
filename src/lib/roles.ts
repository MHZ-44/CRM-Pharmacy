export const ROLE_STORAGE_KEY = "app_role" as const;

export const ROLES = [
  "superadmin",
  "admin",
  "warehouses",
  "pharmacies",
] as const;

export type Role = (typeof ROLES)[number];

export const DEFAULT_ROLE: Role = "superadmin";

export function isRole(value: string | null | undefined): value is Role {
  return !!value && (ROLES as readonly string[]).includes(value);
}

export function getStoredRole(): Role | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return isRole(stored) ? stored : null;
}

export function setStoredRole(role: Role) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ROLE_STORAGE_KEY, role);
}
