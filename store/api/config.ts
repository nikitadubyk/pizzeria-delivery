export enum URL {
  SUPER_ADMIN_LOGIN = "/super-admin/login",
  SUPER_ADMIN_ME = "/super-admin/me",
  SUPER_ADMIN_REFRESH = "/super-admin/refresh",
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
