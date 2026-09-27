import type { PaginatedResponse, SearchPaginationQuery } from "./pagination";

export const INGREDIENT_NAME_MAX_LENGTH = 120;
export const INGREDIENT_LIST_DEFAULT_LIMIT = 10;
export const INGREDIENT_LIST_MAX_LIMIT = 100;

export type IngredientDto = {
  id: string;
  restaurantId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type IngredientPathParams = {
  ingredientId: string;
};

export type IngredientOptionDto = Pick<IngredientDto, "id" | "name">;
export type IngredientListQuery = SearchPaginationQuery;
export type IngredientListResponse = PaginatedResponse<IngredientDto>;

export type CreateIngredientRequest = {
  name: string;
};

export type UpdateIngredientRequest = {
  name?: string;
};
