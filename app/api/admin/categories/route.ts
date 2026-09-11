import type {
  CategoryDto,
  CategoryListQuery,
  CategoryListResponse,
  CreateCategoryRequest,
} from "@/api-contracts";
import { toCategoryDto } from "@/app/api/categories/category.mapper";
import { categoryService } from "@/app/api/categories/category.service";
import {
  categoryListQuerySchema,
  createCategoryRequestSchema,
} from "@/app/api/categories/category.validation";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRequestData,
} from "@/app/api/common/validate-request";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../require-permission";

export const GET = async (request: Request) => {
  try {
    const [identity, pagination] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      validateRequestData<Required<CategoryListQuery>>(
        Object.fromEntries(new URL(request.url).searchParams),
        categoryListQuerySchema,
      ),
    ]);
    const { page, limit } = pagination;
    const { items, total } = await categoryService.getPage(
      identity.restaurant.id,
      pagination,
    );

    return ApiResponse.success<CategoryListResponse>({
      items: items.map(toCategoryDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить категории");
  }
};

export const POST = async (request: Request) => {
  try {
    const [identity, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      validateRequestBody<CreateCategoryRequest>(
        request,
        createCategoryRequestSchema,
      ),
    ]);
    const category = await categoryService.create(
      identity.restaurant.id,
      input,
    );

    return ApiResponse.success<CategoryDto>(
      toCategoryDto(category),
      HttpStatus.CREATED,
    );
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось создать категорию");
  }
};
