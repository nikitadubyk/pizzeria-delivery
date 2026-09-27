import type { IngredientOptionDto } from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import { ingredientService } from "@/app/api/ingredients/ingredient.service";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../../require-permission";

export const GET = async (request: Request) => {
  try {
    const identity = await requireRestaurantPermission(
      request,
      RESTAURANT_PERMISSION.MENU_READ
    );
    const ingredients = await ingredientService.getOptions(
      identity.restaurant.id
    );
    const options = ingredients.map(({ id, name }): IngredientOptionDto => ({
      id,
      name,
    }));

    return ApiResponse.success<IngredientOptionDto[]>(options);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить ингредиенты");
  }
};
