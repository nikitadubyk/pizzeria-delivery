import type { PaginatedResponse, SearchPaginationQuery } from "./pagination";

export type SuperAdminUserDto = {
  id: string;
  restaurantId: null;
  phone: string | null;
  email: string | null;
  name: string | null;
  role: "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RestaurantUserRole = "OWNER" | "EMPLOYEE";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;
export const USER_EMAIL_MAX_LENGTH = 320;
export const USER_LIST_DEFAULT_LIMIT = 10;
export const USER_LIST_MAX_LIMIT = 100;
export const USER_NAME_MAX_LENGTH = 120;
export const USER_PHONE_PATTERN = /^\+7\d{10}$/;
export const RESTAURANT_USER_ROLES = [
  "OWNER",
  "EMPLOYEE",
] as const satisfies readonly RestaurantUserRole[];

export type RestaurantUserDto = {
  id: string;
  restaurantId: string;
  restaurant: {
    id: string;
    name: string;
  };
  phone: string;
  email: string | null;
  name: string | null;
  role: RestaurantUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RestaurantUserPathParams = {
  userId: string;
};

export type RestaurantUserListQuery = SearchPaginationQuery;

export type RestaurantUserListResponse = PaginatedResponse<RestaurantUserDto>;

export type CreateRestaurantUserRequest = {
  restaurantId: string;
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  role: RestaurantUserRole;
  isActive?: boolean;
};

export type UpdateRestaurantUserRequest = {
  restaurantId?: string;
  name?: string;
  phone?: string;
  email?: string | null;
  password?: string;
  role?: RestaurantUserRole;
  isActive?: boolean;
};

export type UpdateRestaurantUserApiRequest = RestaurantUserPathParams & {
  data: UpdateRestaurantUserRequest;
};

export type SuperAdminLoginRequest = {
  email: string;
  password: string;
};

export type SuperAdminLoginResponse = {
  user: SuperAdminUserDto;
  accessToken: string;
  refreshToken: string;
};

export type SuperAdminRefreshRequest = {
  refreshToken: string;
};

export type SuperAdminRefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
