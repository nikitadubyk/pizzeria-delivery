import type {
  CategoryDto,
  CategoryPathParams,
  UpdateCategoryVisibilityRequest,
} from "@/api-contracts";
import { toCategoryDto } from "@/app/api/categories/category.mapper";
import { categoryService } from "@/app/api/categories/category.service";
import {
  categoryPathParamsSchema,
  updateCategoryVisibilityRequestSchema,
} from "@/app/api/categories/category.validation";
import { ApiResponse } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRouteParams,
} from "@/app/api/common/validate-request";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../../../require-permission";

type CategoryVisibilityRouteContext = {
  params: Promise<CategoryPathParams>;
};

export const PATCH = async (
  request: Request,
  { params }: CategoryVisibilityRouteContext,
) => {
  try {
    const [identity, { categoryId }, input] = await Promise.all([
      requireRestaurantPermission(
        request,
        RESTAURANT_PERMISSION.STOP_LIST_MANAGE,
      ),
      params.then((value) =>
        validateRouteParams<CategoryPathParams>(
          value,
          categoryPathParamsSchema,
        ),
      ),
      validateRequestBody<UpdateCategoryVisibilityRequest>(
        request,
        updateCategoryVisibilityRequestSchema,
      ),
    ]);
    const category = await categoryService.updateVisibility(
      identity.restaurant.id,
      categoryId,
      input.isPublished,
    );

    return ApiResponse.success<CategoryDto>(toCategoryDto(category));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось изменить видимость категории");
  }
};
