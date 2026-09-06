import { createApi } from "@reduxjs/toolkit/query/react";

import type {
  CreateRestaurantUserRequest,
  CreateRestaurantRequest,
  RestaurantDto,
  RestaurantListQuery,
  RestaurantListResponse,
  RestaurantPathParams,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  RestaurantUserDto,
  RestaurantUserListQuery,
  RestaurantUserListResponse,
  RestaurantUserPathParams,
  SuperAdminUserDto,
  UpdateRestaurantUserApiRequest,
  UpdateRestaurantApiRequest,
} from "@/api-contracts";
import { axiosBaseQuery } from "./axios";
import { URL } from "./config";

const RESTAURANT_TAG = "Restaurant" as const;
const RESTAURANT_USER_TAG = "RestaurantUser" as const;

export const superAdminApi = createApi({
  reducerPath: "superAdminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [RESTAURANT_TAG, RESTAURANT_USER_TAG],
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
      invalidatesTags: [RESTAURANT_TAG, RESTAURANT_USER_TAG],
    }),
    deleteRestaurant: builder.mutation<RestaurantDto, RestaurantPathParams>({
      query: ({ restaurantId }) => ({
        url: `${URL.SUPER_ADMIN_RESTAURANTS}/${restaurantId}`,
        method: "DELETE",
      }),
      invalidatesTags: [RESTAURANT_TAG, RESTAURANT_USER_TAG],
    }),
    getRestaurantUsers: builder.query<
      RestaurantUserListResponse,
      Required<RestaurantUserListQuery>
    >({
      query: (params) => ({
        url: URL.SUPER_ADMIN_USERS,
        method: "GET",
        params,
      }),
      providesTags: [RESTAURANT_USER_TAG],
    }),
    getRestaurantUser: builder.query<
      RestaurantUserDto,
      RestaurantUserPathParams
    >({
      query: ({ userId }) => ({
        url: `${URL.SUPER_ADMIN_USERS}/${userId}`,
        method: "GET",
      }),
      providesTags: [RESTAURANT_USER_TAG],
    }),
    createRestaurantUser: builder.mutation<
      RestaurantUserDto,
      CreateRestaurantUserRequest
    >({
      query: (data) => ({
        url: URL.SUPER_ADMIN_USERS,
        method: "POST",
        data,
      }),
      invalidatesTags: [RESTAURANT_USER_TAG],
    }),
    updateRestaurantUser: builder.mutation<
      RestaurantUserDto,
      UpdateRestaurantUserApiRequest
    >({
      query: ({ userId, data }) => ({
        url: `${URL.SUPER_ADMIN_USERS}/${userId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [RESTAURANT_USER_TAG],
    }),
    deleteRestaurantUser: builder.mutation<
      RestaurantUserDto,
      RestaurantUserPathParams
    >({
      query: ({ userId }) => ({
        url: `${URL.SUPER_ADMIN_USERS}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [RESTAURANT_USER_TAG],
    }),
  }),
});

export const {
  useCreateRestaurantMutation,
  useCreateRestaurantUserMutation,
  useDeleteRestaurantMutation,
  useDeleteRestaurantUserMutation,
  useGetRestaurantQuery,
  useGetRestaurantsQuery,
  useGetSuperAdminMeQuery,
  useGetRestaurantUserQuery,
  useGetRestaurantUsersQuery,
  useLoginSuperAdminMutation,
  useUpdateRestaurantMutation,
  useUpdateRestaurantUserMutation,
} = superAdminApi;
