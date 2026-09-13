import type { ProductVariantDto } from "@/api-contracts";
import type { ProductVariant } from "@/app/generated/prisma/client";

export const toProductVariantDto = (
  variant: ProductVariant,
): ProductVariantDto => ({
  id: variant.id,
  name: variant.name,
  price: variant.price,
  weight: variant.weight,
  isAvailable: variant.isAvailable,
  sortOrder: variant.sortOrder,
});
