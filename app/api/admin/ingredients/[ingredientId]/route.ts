import type {
  IngredientDto,
  IngredientPathParams,
  UpdateIngredientRequest,
} from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRouteParams,
} from "@/app/api/common/validate-request";
import { toIngredientDto } from "@/app/api/ingredients/ingredient.mapper";
import { ingredientService } from "@/app/api/ingredients/ingredient.service";
import {
  ingredientPathParamsSchema,
  updateIngredientRequestSchema,
} from "@/app/api/ingredients/ingredient.validation";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../../require-permission";

type IngredientRouteContext = {
  params: Promise<IngredientPathParams>;
};

export const GET = async (
  request: Request,
  { params }: IngredientRouteContext
) => {
  try {
    const [identity, { ingredientId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      params.then((value) =>
        validateRouteParams<IngredientPathParams>(
          value,
          ingredientPathParamsSchema
        )
      ),
    ]);
    const ingredient = await ingredientService.getById(
      identity.restaurant.id,
      ingredientId
    );

    return ApiResponse.success<IngredientDto>(toIngredientDto(ingredient));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить ингредиент");
  }
};
export const PATCH = async (
  request: Request,
  { params }: IngredientRouteContext
) => {
  try {
    const [identity, { ingredientId }, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) =>
        validateRouteParams<IngredientPathParams>(
          value,
          ingredientPathParamsSchema
        )
      ),
      validateRequestBody<UpdateIngredientRequest>(
        request,
        updateIngredientRequestSchema
      ),
    ]);
    const ingredient = await ingredientService.update(
      identity.restaurant.id,
      ingredientId,
      input
    );

    return ApiResponse.success<IngredientDto>(toIngredientDto(ingredient));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить ингредиент");
  }
};
export const DELETE = async (
  request: Request,
  { params }: IngredientRouteContext
) => {
  try {
    const [identity, { ingredientId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) =>
        validateRouteParams<IngredientPathParams>(
          value,
          ingredientPathParamsSchema
        )
      ),
    ]);
    const ingredient = await ingredientService.delete(
      identity.restaurant.id,
      ingredientId
    );

    return ApiResponse.success<IngredientDto>(toIngredientDto(ingredient));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось удалить ингредиент");
  }
};
