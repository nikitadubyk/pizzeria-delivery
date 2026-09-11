import type { PaginatedResponse, PaginationQuery } from "./pagination";

export const CATEGORY_NAME_MAX_LENGTH = 120;
export const CATEGORY_LIST_DEFAULT_LIMIT = 10;
export const CATEGORY_LIST_MAX_LIMIT = 100;
export const CATEGORY_SORT_ORDER_MAX = 2_147_483_647;

export type CategoryDto = {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryPathParams = {
  categoryId: string;
};

export type CategoryListQuery = PaginationQuery;

export type CategoryListResponse = PaginatedResponse<CategoryDto>;

export type CreateCategoryRequest = {
  name: string;
  sortOrder?: number;
  isPublished?: boolean;
};

export type UpdateCategoryRequest = {
  name?: string;
  sortOrder?: number;
  isPublished?: boolean;
};

export type UpdateCategoryApiRequest = CategoryPathParams & {
  data: UpdateCategoryRequest;
};
