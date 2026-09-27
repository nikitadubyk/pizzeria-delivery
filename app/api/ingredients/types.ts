import type {
  CreateIngredientRequest,
  ResolvedSearchPaginationQuery,
  UpdateIngredientRequest,
} from "@/api-contracts";
import type { Ingredient } from "@/app/generated/prisma/client";

export type IngredientPage = {
  items: Ingredient[];
  total: number;
};

export interface IngredientRepository {
  findPage(
    restaurantId: string,
    query: ResolvedSearchPaginationQuery
  ): Promise<IngredientPage>;
  findOptions(restaurantId: string): Promise<Ingredient[]>;
  findById(
    restaurantId: string,
    ingredientId: string
  ): Promise<Ingredient | null>;
  create(
    restaurantId: string,
    data: CreateIngredientRequest
  ): Promise<Ingredient>;
  update(
    restaurantId: string,
    ingredientId: string,
    data: UpdateIngredientRequest
  ): Promise<Ingredient>;
  delete(restaurantId: string, ingredientId: string): Promise<Ingredient>;
}
