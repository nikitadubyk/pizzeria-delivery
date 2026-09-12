import type { CategoryOptionDto } from "@/api-contracts";
import { categoryService } from "@/app/api/categories/category.service";
import { ApiResponse } from "@/app/api/common/api-response";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../../require-permission";

export const GET = async (request: Request) => {
  try {
    const identity = await requireRestaurantPermission(
      request,
      RESTAURANT_PERMISSION.MENU_READ,
    );
    const categories = await categoryService.getOptions(identity.restaurant.id);
    const options = categories.map(({ id, name }): CategoryOptionDto => ({
      id,
      name,
    }));

    return ApiResponse.success<CategoryOptionDto[]>(options);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить категории");
  }
};
