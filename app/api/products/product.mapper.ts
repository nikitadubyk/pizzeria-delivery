import type { ProductDto } from "@/api-contracts";
import type { ProductWithCategory } from "@/app/api/products/types";

import { toProductVariantDto } from "./product-variant.mapper";

export const toProductDto = (product: ProductWithCategory): ProductDto => ({
  id: product.id,
  restaurantId: product.restaurantId,
  categoryId: product.categoryId,
  category: product.category,
  name: product.name,
  description: product.description,
  baseComposition: product.baseComposition,
  imageUrl: product.imageUrl,
  sortOrder: product.sortOrder,
  isPublished: product.isPublished,
  variants: product.variants.map(toProductVariantDto),
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});
