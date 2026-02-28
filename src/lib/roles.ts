export const ROLE_STORAGE_KEY = "app_role" as const;
export const TOKEN_STORAGE_KEYS = [
  "token",
  "access_token",
  "auth_token",
] as const;

export const ROLES = [
  "superadmin",
  "admin",
  "warehouse",
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

function normalizeRole(value: unknown): Role | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");

  if (normalized === "super_admin") {
    return "superadmin";
  }
  if (normalized === "pharmacist" || normalized === "pharmacy") {
    return "pharmacies";
  }
  if (normalized === "warehouse_owner") {
    return "warehouse";
  }
  return isRole(normalized) ? normalized : null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractRoleFromPayload(payload: Record<string, unknown>): Role | null {
  const directFields = ["role", "user_role", "type"] as const;
  for (const field of directFields) {
    const role = normalizeRole(payload[field]);
    if (role) {
      return role;
    }
  }

  const roles = payload.roles;
  if (Array.isArray(roles)) {
    for (const item of roles) {
      const role = normalizeRole(item);
      if (role) {
        return role;
      }
    }
  }

  const user = payload.user;
  if (user && typeof user === "object") {
    const nested = user as Record<string, unknown>;
    const role = normalizeRole(nested.role ?? nested.user_role ?? nested.type);
    if (role) {
      return role;
    }
  }

  return null;
}

export function getRoleFromToken(token: string | null | undefined): Role | null {
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  return extractRoleFromPayload(payload);
}

export function getRoleFromAuthToken(): Role | null {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of TOKEN_STORAGE_KEYS) {
    const token = window.localStorage.getItem(key);
    const role = getRoleFromToken(token);
    if (role) {
      return role;
    }
  }

  return null;
}
