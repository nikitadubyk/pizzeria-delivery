import type { PaginatedResponse, SearchPaginationQuery } from "./pagination";

export const ADDON_NAME_MAX_LENGTH = 120;
export const ADDON_PRICE_MAX = 2_147_483_647;
export const ADDON_LIST_DEFAULT_LIMIT = 10;
export const ADDON_LIST_MAX_LIMIT = 100;

export type AddonDto = {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddonPathParams = { addonId: string };
export type AddonListQuery = SearchPaginationQuery;
export type AddonListResponse = PaginatedResponse<AddonDto>;
export type CreateAddonRequest = {
  name: string;
  price: number;
  isAvailable?: boolean;
};
export type UpdateAddonRequest = Partial<CreateAddonRequest>;
export type UpdateAddonApiRequest = AddonPathParams & {
  data: UpdateAddonRequest;
};
export type UpdateAddonAvailabilityRequest = { isAvailable: boolean };
export type UpdateAddonAvailabilityApiRequest = AddonPathParams & {
  data: UpdateAddonAvailabilityRequest;
};
