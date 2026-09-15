import type {
  ProductDto,
  ProductPathParams,
  UpdateProductAvailabilityRequest,
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
  updateProductAvailabilityRequestSchema,
} from "@/app/api/products/product.validation";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../../../require-permission";

type ProductAvailabilityRouteContext = {
  params: Promise<ProductPathParams>;
};

export const PATCH = async (
  request: Request,
  { params }: ProductAvailabilityRouteContext,
) => {
  try {
    const [identity, { productId }, input] = await Promise.all([
      requireRestaurantPermission(
        request,
        RESTAURANT_PERMISSION.STOP_LIST_MANAGE,
      ),
      params.then((value) =>
        validateRouteParams<ProductPathParams>(
          value,
          productPathParamsSchema,
        ),
      ),
      validateRequestBody<UpdateProductAvailabilityRequest>(
        request,
        updateProductAvailabilityRequestSchema,
      ),
    ]);
    const product = await productService.updateAvailability(
      identity.restaurant.id,
      productId,
      input.isAvailable,
    );

    return ApiResponse.success<ProductDto>(toProductDto(product));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось изменить доступность продукта");
  }
};
