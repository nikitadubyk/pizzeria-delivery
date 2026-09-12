import type { ProductDto, ProductPathParams } from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import { validateRouteParams } from "@/app/api/common/validate-request";
import { toProductDto } from "@/app/api/products/product.mapper";
import { productService } from "@/app/api/products/product.service";
import { productPathParamsSchema } from "@/app/api/products/product.validation";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../../../require-permission";

type ProductImageRouteContext = {
  params: Promise<ProductPathParams>;
};

export const DELETE = async (
  request: Request,
  { params }: ProductImageRouteContext,
) => {
  try {
    const [identity, { productId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) =>
        validateRouteParams<ProductPathParams>(value, productPathParamsSchema),
      ),
    ]);
    const product = await productService.removeImage(
      identity.restaurant.id,
      productId,
    );

    return ApiResponse.success<ProductDto>(toProductDto(product));
  } catch (error) {
    return ApiResponse.fromError(
      error,
      "Не удалось удалить изображение продукта",
    );
  }
};
