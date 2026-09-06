import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import type { RestaurantIdentity, RestaurantLoginInput, RestaurantLoginResponse } from "@/api-contracts";
import type { RootState } from "../store";
import { createAxiosBaseQuery } from "./axios";
import { API_BASE_URL, URL } from "./config";

export const restaurantClient = axios.create({ baseURL: API_BASE_URL, withCredentials: false });
const baseQuery = createAxiosBaseQuery(restaurantClient);

const restaurantBaseQuery: ReturnType<typeof createAxiosBaseQuery> =
  (args, api, extraOptions) => {
    const token = (api.getState() as RootState).restaurantAuth.token;
    return baseQuery({
      ...args,
      headers: token && args.url !== URL.RESTAURANT_LOGIN
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }, api, extraOptions);
  };

export const restaurantAuthApi = createApi({
  reducerPath: "restaurantAuthApi",
  baseQuery: restaurantBaseQuery,
  endpoints: builder => ({
    loginRestaurant: builder.mutation<RestaurantLoginResponse, RestaurantLoginInput>({
      query: data => ({ url: URL.RESTAURANT_LOGIN, method: "POST", data }),
    }),
    getRestaurantMe: builder.query<RestaurantIdentity, void>({
      query: () => ({ url: URL.RESTAURANT_ME, method: "GET" }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLoginRestaurantMutation, useGetRestaurantMeQuery } = restaurantAuthApi;
