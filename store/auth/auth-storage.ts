import type { SuperAdminUser } from "./types";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = AuthTokens & {
  user: SuperAdminUser;
};

enum AuthStorageKey {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
  USER = "superAdminUser",
}

const isBrowser = () => typeof window !== "undefined";

export const getAccessToken = () =>
  isBrowser() ? localStorage.getItem(AuthStorageKey.ACCESS_TOKEN) : null;

export const getRefreshToken = () =>
  isBrowser() ? localStorage.getItem(AuthStorageKey.REFRESH_TOKEN) : null;

export const getStoredUser = (): SuperAdminUser | null => {
  if (!isBrowser()) return null;

  const storedUser = localStorage.getItem(AuthStorageKey.USER);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as SuperAdminUser;
  } catch {
    localStorage.removeItem(AuthStorageKey.USER);
    return null;
  }
};

export const saveTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  if (!isBrowser()) return;

  localStorage.setItem(AuthStorageKey.ACCESS_TOKEN, accessToken);
  localStorage.setItem(AuthStorageKey.REFRESH_TOKEN, refreshToken);
};

export const saveUser = (user: SuperAdminUser) => {
  if (!isBrowser()) return;

  localStorage.setItem(AuthStorageKey.USER, JSON.stringify(user));
};

export const saveAuthSession = ({ user, ...tokens }: AuthSession) => {
  saveTokens(tokens);
  saveUser(user);
};

export const clearAuthSession = () => {
  if (!isBrowser()) return;

  localStorage.removeItem(AuthStorageKey.ACCESS_TOKEN);
  localStorage.removeItem(AuthStorageKey.REFRESH_TOKEN);
  localStorage.removeItem(AuthStorageKey.USER);
};
