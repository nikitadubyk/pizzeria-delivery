import type { PaginatedResponse, SearchPaginationQuery } from "./pagination";

export type RestaurantStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export const RESTAURANT_NAME_MAX_LENGTH = 120;
export const RESTAURANT_SLUG_MAX_LENGTH = 100;
export const RESTAURANT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const RESTAURANT_LIST_DEFAULT_LIMIT = 10;
export const RESTAURANT_LIST_MAX_LIMIT = 100;
export const RESTAURANT_STATUSES = [
  "ACTIVE",
  "SUSPENDED",
  "ARCHIVED",
] as const satisfies readonly RestaurantStatus[];

export type RestaurantDto = {
  id: string;
  name: string;
  slug: string;
  status: RestaurantStatus;
  createdAt: string;
  updatedAt: string;
};

export type RestaurantPathParams = {
  restaurantId: string;
};

export type RestaurantListQuery = SearchPaginationQuery;

export type RestaurantListResponse = PaginatedResponse<RestaurantDto>;

export type CreateRestaurantRequest = {
  name: string;
  slug: string;
  status?: RestaurantStatus;
};

export type UpdateRestaurantRequest = {
  name?: string;
  slug?: string;
  status?: RestaurantStatus;
};

export type UpdateRestaurantApiRequest = RestaurantPathParams & {
  data: UpdateRestaurantRequest;
};
