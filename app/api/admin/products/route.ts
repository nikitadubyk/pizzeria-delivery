import type {
  CreateProductRequest,
  ProductDto,
  ProductListQuery,
  ProductListResponse,
  ResolvedSearchPaginationQuery,
} from "@/api-contracts";
import { createPaginationMeta } from "@/app/api/common/list-query";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRequestData,
} from "@/app/api/common/validate-request";
import { toProductDto } from "@/app/api/products/product.mapper";
import { productService } from "@/app/api/products/product.service";
import {
  createProductRequestSchema,
  productListQuerySchema,
} from "@/app/api/products/product.validation";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../require-permission";

export const GET = async (request: Request) => {
  try {
    const [identity, query] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      validateRequestData<
        ResolvedSearchPaginationQuery &
          Pick<ProductListQuery, "categoryId" | "isPublished">
      >(
        Object.fromEntries(new URL(request.url).searchParams),
        productListQuerySchema,
      ),
    ]);
    const { page, limit } = query;
    const { items, total } = await productService.getPage(
      identity.restaurant.id,
      query,
    );

    return ApiResponse.success<ProductListResponse>({
      items: items.map(toProductDto),
      pagination: createPaginationMeta({ page, limit, total }),
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить продукты");
  }
};

export const POST = async (request: Request) => {
  try {
    const [identity, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      validateRequestBody<CreateProductRequest>(
        request,
        createProductRequestSchema,
      ),
    ]);
    const product = await productService.create(identity.restaurant.id, input);

    return ApiResponse.success<ProductDto>(
      toProductDto(product),
      HttpStatus.CREATED,
    );
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось создать продукт");
  }
};
