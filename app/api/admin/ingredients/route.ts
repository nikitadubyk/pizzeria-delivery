import type {
  CreateIngredientRequest,
  IngredientDto,
  IngredientListResponse,
  ResolvedSearchPaginationQuery,
} from "@/api-contracts";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import { createPaginationMeta } from "@/app/api/common/list-query";
import {
  validateRequestBody,
  validateRequestData,
} from "@/app/api/common/validate-request";
import { toIngredientDto } from "@/app/api/ingredients/ingredient.mapper";
import { ingredientService } from "@/app/api/ingredients/ingredient.service";
import {
  createIngredientRequestSchema,
  ingredientListQuerySchema,
} from "@/app/api/ingredients/ingredient.validation";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../require-permission";

export const GET = async (request: Request) => {
  try {
    const [identity, pagination] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      validateRequestData<ResolvedSearchPaginationQuery>(
        Object.fromEntries(new URL(request.url).searchParams),
        ingredientListQuerySchema
      ),
    ]);
    const { page, limit } = pagination;
    const { items, total } = await ingredientService.getPage(
      identity.restaurant.id,
      pagination
    );

    return ApiResponse.success<IngredientListResponse>({
      items: items.map(toIngredientDto),
      pagination: createPaginationMeta({ page, limit, total }),
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить ингредиенты");
  }
};

export const POST = async (request: Request) => {
  try {
    const [identity, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      validateRequestBody<CreateIngredientRequest>(
        request,
        createIngredientRequestSchema
      ),
    ]);
    const ingredient = await ingredientService.create(
      identity.restaurant.id,
      input
    );

    return ApiResponse.success<IngredientDto>(
      toIngredientDto(ingredient),
      HttpStatus.CREATED
    );
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось создать ингредиент");
  }
};
