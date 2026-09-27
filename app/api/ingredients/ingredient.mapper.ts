import type { IngredientDto } from "@/api-contracts";
import type { Ingredient } from "@/app/generated/prisma/client";

export const toIngredientDto = (ingredient: Ingredient): IngredientDto => ({
  id: ingredient.id,
  restaurantId: ingredient.restaurantId,
  name: ingredient.name,
  createdAt: ingredient.createdAt.toISOString(),
  updatedAt: ingredient.updatedAt.toISOString(),
});
