import { createApi } from "@reduxjs/toolkit/query/react";

import type { SuperAdminUser } from "../auth/types";
import { axiosLoaderBaseQuery } from "./axios";
import { URL } from "./config";

export type SuperAdminLoginRequest = {
  email: string;
  password: string;
};

export type SuperAdminLoginResponse = {
  user: SuperAdminUser;
  accessToken: string;
  refreshToken: string;
};

export const superAdminApi = createApi({
  reducerPath: "superAdminApi",
  baseQuery: axiosLoaderBaseQuery(),
  endpoints: (builder) => ({
    getSuperAdminMe: builder.query<SuperAdminUser, void>({
      query: () => ({
        url: URL.SUPER_ADMIN_ME,
        method: "GET",
      }),
    }),
    loginSuperAdmin: builder.mutation<
      SuperAdminLoginResponse,
      SuperAdminLoginRequest
    >({
      query: (body) => ({
        url: URL.SUPER_ADMIN_LOGIN,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const { useGetSuperAdminMeQuery, useLoginSuperAdminMutation } =
  superAdminApi;
