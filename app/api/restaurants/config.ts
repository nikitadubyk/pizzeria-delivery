import type { RestaurantStatus } from "@/api-contracts";

export const RESTAURANT_NAME_MAX_LENGTH = 120;
export const RESTAURANT_SLUG_MAX_LENGTH = 100;
export const RESTAURANT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const RESTAURANT_LIST_DEFAULT_LIMIT = 10;
export const RESTAURANT_LIST_MAX_LIMIT = 100;
export const RESTAURANT_STATUSES: readonly RestaurantStatus[] = [
  "ACTIVE",
  "SUSPENDED",
  "ARCHIVED",
];
