import type {
  ProductDto,
  ProductPathParams,
  UpdateProductRequest,
} from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRouteParams,
} from "@/app/api/common/validate-request";
import { toProductDto } from "@/app/api/products/product.mapper";
import { productService } from "@/app/api/products/product.service";
import {
  productPathParamsSchema,
  updateProductRequestSchema,
} from "@/app/api/products/product.validation";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../../require-permission";

type ProductRouteContext = {
  params: Promise<ProductPathParams>;
};

export const GET = async (request: Request, { params }: ProductRouteContext) => {
  try {
    const [identity, { productId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      params.then((value) =>
        validateRouteParams<ProductPathParams>(
          value,
          productPathParamsSchema,
        ),
      ),
    ]);
    const product = await productService.getById(
      identity.restaurant.id,
      productId,
    );

    return ApiResponse.success<ProductDto>(toProductDto(product));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить продукт");
  }
};

export const PATCH = async (
  request: Request,
  { params }: ProductRouteContext,
) => {
  try {
    const [identity, { productId }, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) =>
        validateRouteParams<ProductPathParams>(
          value,
          productPathParamsSchema,
        ),
      ),
      validateRequestBody<UpdateProductRequest>(
        request,
        updateProductRequestSchema,
      ),
    ]);
    const product = await productService.update(
      identity.restaurant.id,
      productId,
      input,
    );

    return ApiResponse.success<ProductDto>(toProductDto(product));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить продукт");
  }
};

export const DELETE = async (
  request: Request,
  { params }: ProductRouteContext,
) => {
  try {
    const [identity, { productId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) =>
        validateRouteParams<ProductPathParams>(
          value,
          productPathParamsSchema,
        ),
      ),
    ]);
    const product = await productService.delete(
      identity.restaurant.id,
      productId,
    );

    return ApiResponse.success<ProductDto>(toProductDto(product));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось удалить продукт");
  }
};
