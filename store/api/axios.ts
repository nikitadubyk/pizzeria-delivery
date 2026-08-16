import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { showErrorNotification } from "@/components/ui/notification";

import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  type AuthTokens,
} from "../auth/auth-storage";
import { clearAuthUser } from "../slices/auth.slice";
import { startLoading, stopLoading } from "../slices/loader.slice";
import type { AppDispatch } from "../store";
import { API_BASE_URL, URL } from "./config";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type AxiosBaseQueryArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
};

type AxiosBaseQueryError = {
  status: number;
  data: unknown;
};

const refreshClient = axios.create({ baseURL: API_BASE_URL });

export const apiClient = axios.create({ baseURL: API_BASE_URL });
export const apiLoaderClient = axios.create({ baseURL: API_BASE_URL });

const attachAccessToken = (config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();

  if (accessToken && config.url !== URL.SUPER_ADMIN_LOGIN) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
};

apiClient.interceptors.request.use(attachAccessToken);
apiLoaderClient.interceptors.request.use(attachAccessToken);

let refreshPromise: Promise<AuthTokens> | null = null;

const refreshTokens = () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return Promise.reject(new Error("Refresh token отсутствует"));
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<AuthTokens>(URL.SUPER_ADMIN_REFRESH, { refreshToken })
      .then(({ data }) => {
        saveTokens(data);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const getErrorMessage = (error: AxiosError) => {
  const data = error.response?.data;

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return "Не удалось выполнить запрос";
};

const notifyError = (error: AxiosError) =>
  showErrorNotification({ message: getErrorMessage(error) });

let activeDispatch: AppDispatch | null = null;

const handleResponseError = async (
  instance: AxiosInstance,
  error: AxiosError,
) => {
  const request = error.config as RetriableRequestConfig | undefined;
  const shouldRefresh =
    error.response?.status === 401 &&
    request &&
    !request._retry &&
    request.url !== URL.SUPER_ADMIN_LOGIN &&
    request.url !== URL.SUPER_ADMIN_REFRESH;

  if (!shouldRefresh) {
    notifyError(error);
    return Promise.reject(error);
  }

  request._retry = true;

  try {
    const tokens = await refreshTokens();
    request.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    return instance.request(request);
  } catch (refreshError) {
    clearAuthSession();
    activeDispatch?.(clearAuthUser());
    notifyError(refreshError instanceof AxiosError ? refreshError : error);
    return Promise.reject(refreshError);
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => handleResponseError(apiClient, error),
);

apiLoaderClient.interceptors.request.use(
  (config) => {
    activeDispatch?.(startLoading());
    return config;
  },
  (error) => {
    activeDispatch?.(stopLoading());
    return Promise.reject(error);
  },
);

apiLoaderClient.interceptors.response.use(
  (response) => {
    activeDispatch?.(stopLoading());
    return response;
  },
  (error: AxiosError) => {
    activeDispatch?.(stopLoading());
    return handleResponseError(apiLoaderClient, error);
  },
);

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  activeDispatch = dispatch;

  return () => {
    if (activeDispatch === dispatch) {
      activeDispatch = null;
    }
  };
};

const createAxiosBaseQuery =
  (
    instance: AxiosInstance,
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method, data, params }) => {
    try {
      const response = await instance({ url, method, data, params });
      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status ?? 500,
          data: axiosError.response?.data ?? {
            error: "Не удалось выполнить запрос",
          },
        },
      };
    }
  };

export const axiosBaseQuery = () => createAxiosBaseQuery(apiClient);
export const axiosLoaderBaseQuery = () => createAxiosBaseQuery(apiLoaderClient);
