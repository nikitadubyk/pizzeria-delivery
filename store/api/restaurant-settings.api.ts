import type {
  RestaurantSettingsDto,
  UpdateRestaurantSettingsRequest,
} from "@/api-contracts";

import { URL } from "./config";
import { restaurantAuthApi } from "./restaurant-auth.api";

const RESTAURANT_SETTINGS_TAG = "RestaurantSettings" as const;

export const restaurantSettingsApi = restaurantAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurantSettings: builder.query<RestaurantSettingsDto, void>({
      query: () => ({
        url: URL.RESTAURANT_SETTINGS,
        method: "GET",
      }),
      providesTags: [RESTAURANT_SETTINGS_TAG],
    }),
    updateRestaurantSettings: builder.mutation<
      RestaurantSettingsDto,
      UpdateRestaurantSettingsRequest
    >({
      query: (data) => ({
        url: URL.RESTAURANT_SETTINGS,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [RESTAURANT_SETTINGS_TAG],
    }),
  }),
});

export const {
  useGetRestaurantSettingsQuery,
  useUpdateRestaurantSettingsMutation,
} = restaurantSettingsApi;
