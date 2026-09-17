import type {
  AddonDto,
  AddonListResponse,
  AddonPathParams,
  CreateAddonRequest,
  ResolvedSearchPaginationQuery,
  UpdateAddonApiRequest,
  UpdateAddonAvailabilityApiRequest,
} from "@/api-contracts";
import { API_ROUTES, URL } from "./config";
import { restaurantAuthApi } from "./restaurant-auth.api";

const ADDON_TAG = "Addon" as const;

export const addonsApi = restaurantAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddons: builder.query<AddonListResponse, ResolvedSearchPaginationQuery>({
      query: (params) => ({ url: URL.RESTAURANT_ADDONS, method: "GET", params }),
      providesTags: [ADDON_TAG],
    }),
    getAddon: builder.query<AddonDto, AddonPathParams>({
      query: ({ addonId }) => ({ url: API_ROUTES.restaurantAddon(addonId), method: "GET" }),
      providesTags: [ADDON_TAG],
    }),
    createAddon: builder.mutation<AddonDto, CreateAddonRequest>({
      query: (data) => ({ url: URL.RESTAURANT_ADDONS, method: "POST", data }),
      invalidatesTags: [ADDON_TAG],
    }),
    updateAddon: builder.mutation<AddonDto, UpdateAddonApiRequest>({
      query: ({ addonId, data }) => ({ url: API_ROUTES.restaurantAddon(addonId), method: "PATCH", data }),
      invalidatesTags: [ADDON_TAG],
    }),
    updateAddonAvailability: builder.mutation<AddonDto, UpdateAddonAvailabilityApiRequest>({
      query: ({ addonId, data }) => ({ url: API_ROUTES.restaurantAddonAvailability(addonId), method: "PATCH", data }),
      invalidatesTags: [ADDON_TAG],
    }),
    deleteAddon: builder.mutation<AddonDto, AddonPathParams>({
      query: ({ addonId }) => ({ url: API_ROUTES.restaurantAddon(addonId), method: "DELETE" }),
      invalidatesTags: [ADDON_TAG],
    }),
  }),
});

export const {
  useGetAddonsQuery,
  useGetAddonQuery,
  useCreateAddonMutation,
  useUpdateAddonMutation,
  useUpdateAddonAvailabilityMutation,
  useDeleteAddonMutation,
} = addonsApi;
