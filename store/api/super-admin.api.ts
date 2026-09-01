import { createApi } from "@reduxjs/toolkit/query/react";

import type {
  CreateRestaurantRequest,
  RestaurantDto,
  RestaurantListQuery,
  RestaurantListResponse,
  RestaurantPathParams,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminUserDto,
  UpdateRestaurantApiRequest,
} from "@/api-contracts";
import { axiosLoaderBaseQuery } from "./axios";
import { URL } from "./config";

const RESTAURANT_TAG = "Restaurant" as const;

export const superAdminApi = createApi({
  reducerPath: "superAdminApi",
  baseQuery: axiosLoaderBaseQuery(),
  tagTypes: [RESTAURANT_TAG],
  endpoints: (builder) => ({
    getSuperAdminMe: builder.query<SuperAdminUserDto, void>({
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
    getRestaurants: builder.query<
      RestaurantListResponse,
      Required<RestaurantListQuery>
    >({
      query: (params) => ({
        url: URL.SUPER_ADMIN_RESTAURANTS,
        method: "GET",
        params,
      }),
      providesTags: [RESTAURANT_TAG],
    }),
    getRestaurant: builder.query<RestaurantDto, RestaurantPathParams>({
      query: ({ restaurantId }) => ({
        url: `${URL.SUPER_ADMIN_RESTAURANTS}/${restaurantId}`,
        method: "GET",
      }),
      providesTags: [RESTAURANT_TAG],
    }),
    createRestaurant: builder.mutation<RestaurantDto, CreateRestaurantRequest>({
      query: (data) => ({
        url: URL.SUPER_ADMIN_RESTAURANTS,
        method: "POST",
        data,
      }),
      invalidatesTags: [RESTAURANT_TAG],
    }),
    updateRestaurant: builder.mutation<
      RestaurantDto,
      UpdateRestaurantApiRequest
    >({
      query: ({ restaurantId, data }) => ({
        url: `${URL.SUPER_ADMIN_RESTAURANTS}/${restaurantId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [RESTAURANT_TAG],
    }),
    deleteRestaurant: builder.mutation<RestaurantDto, RestaurantPathParams>({
      query: ({ restaurantId }) => ({
        url: `${URL.SUPER_ADMIN_RESTAURANTS}/${restaurantId}`,
        method: "DELETE",
      }),
      invalidatesTags: [RESTAURANT_TAG],
    }),
  }),
});

export const {
  useCreateRestaurantMutation,
  useDeleteRestaurantMutation,
  useGetRestaurantQuery,
  useGetRestaurantsQuery,
  useGetSuperAdminMeQuery,
  useLoginSuperAdminMutation,
  useUpdateRestaurantMutation,
} = superAdminApi;
