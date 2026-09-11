import type {
  CategoryDto,
  CategoryPathParams,
  UpdateCategoryRequest,
} from "@/api-contracts";
import { toCategoryDto } from "@/app/api/categories/category.mapper";
import { categoryService } from "@/app/api/categories/category.service";
import {
  categoryPathParamsSchema,
  updateCategoryRequestSchema,
} from "@/app/api/categories/category.validation";
import { ApiResponse } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRouteParams,
} from "@/app/api/common/validate-request";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../../require-permission";

type CategoryRouteContext = {
  params: Promise<CategoryPathParams>;
};

export const GET = async (
  request: Request,
  { params }: CategoryRouteContext,
) => {
  try {
    const [identity, { categoryId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      params.then((value) =>
        validateRouteParams<CategoryPathParams>(
          value,
          categoryPathParamsSchema,
        ),
      ),
    ]);
    const category = await categoryService.getById(
      identity.restaurant.id,
      categoryId,
    );

    return ApiResponse.success<CategoryDto>(toCategoryDto(category));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить категорию");
  }
};

export const PATCH = async (
  request: Request,
  { params }: CategoryRouteContext,
) => {
  try {
    const [identity, { categoryId }, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) =>
        validateRouteParams<CategoryPathParams>(
          value,
          categoryPathParamsSchema,
        ),
      ),
      validateRequestBody<UpdateCategoryRequest>(
        request,
        updateCategoryRequestSchema,
      ),
    ]);
    const category = await categoryService.update(
      identity.restaurant.id,
      categoryId,
      input,
    );

    return ApiResponse.success<CategoryDto>(toCategoryDto(category));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить категорию");
  }
};

export const DELETE = async (
  request: Request,
  { params }: CategoryRouteContext,
) => {
  try {
    const [identity, { categoryId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) =>
        validateRouteParams<CategoryPathParams>(
          value,
          categoryPathParamsSchema,
        ),
      ),
    ]);
    const category = await categoryService.delete(
      identity.restaurant.id,
      categoryId,
    );

    return ApiResponse.success<CategoryDto>(toCategoryDto(category));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось удалить категорию");
  }
};
