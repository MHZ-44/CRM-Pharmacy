import type { Role } from "@/lib/roles";

export type LoginRole = "admin" | "pharmacies" | "warehouse";
export type OtpLoginRole = Extract<LoginRole, "pharmacies" | "warehouse">;

export type LoginPayload = {
  login: string;
  password: string;
};

export type OtpLoginResponse = {
  message?: string;
  otp_request_token?: string;
  data?: {
    otp_request_token?: string;
  };
};

export type VerifyOtpPayload = {
  otp: string;
};

export type VerifyOtpResponse = {
  token?: string;
  role?: string;
  user?: {
    role?: string;
  };
  pharmacy?: {
    role?: string;
  };
  warehouse?: {
    role?: string;
  };
  message?: string;
};

export type ResendOtpPayload = {
  otp_request_token: string;
};

export type ResendOtpResponse = OtpLoginResponse;

export type ResetPasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type AuthenticatedRole = Exclude<Role, "superadmin">;
