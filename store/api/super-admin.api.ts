import { createApi } from "@reduxjs/toolkit/query/react";

import type {
  CreateRestaurantUserRequest,
  CreateRestaurantRequest,
  ResolvedSearchPaginationQuery,
  RestaurantDto,
  RestaurantListResponse,
  RestaurantPathParams,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  RestaurantUserDto,
  RestaurantUserListResponse,
  RestaurantUserPathParams,
  SuperAdminUserDto,
  UpdateRestaurantUserApiRequest,
  UpdateRestaurantApiRequest,
} from "@/api-contracts";
import { axiosBaseQuery } from "./axios";
import { API_ROUTES, URL } from "./config";

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
      ResolvedSearchPaginationQuery
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
        url: API_ROUTES.superAdminRestaurant(restaurantId),
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
        url: API_ROUTES.superAdminRestaurant(restaurantId),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [RESTAURANT_TAG, RESTAURANT_USER_TAG],
    }),
    deleteRestaurant: builder.mutation<RestaurantDto, RestaurantPathParams>({
      query: ({ restaurantId }) => ({
        url: API_ROUTES.superAdminRestaurant(restaurantId),
        method: "DELETE",
      }),
      invalidatesTags: [RESTAURANT_TAG, RESTAURANT_USER_TAG],
    }),
    getRestaurantUsers: builder.query<
      RestaurantUserListResponse,
      ResolvedSearchPaginationQuery
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
        url: API_ROUTES.superAdminUser(userId),
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
        url: API_ROUTES.superAdminUser(userId),
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
        url: API_ROUTES.superAdminUser(userId),
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
