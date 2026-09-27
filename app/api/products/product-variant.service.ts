import type { ProductVariantRequest } from "@/api-contracts";
import type { Prisma } from "@/app/generated/prisma/client";

import type { ProductVariantWrite } from "./types";

export class ProductVariantService {
  prepareForCreate(
    variants: readonly ProductVariantRequest[]
  ): ProductVariantWrite[] {
    return variants.map((variant, sortOrder) => ({
      name: variant.name ?? null,
      price: variant.price,
      weight: variant.weight ?? null,
      isAvailable: variant.isAvailable ?? true,
      sortOrder,
    }));
  }

  prepareForUpdate(
    variants: readonly ProductVariantRequest[]
  ): ProductVariantWrite[] {
    return variants.map((variant, sortOrder) => ({
      id: variant.id,
      name: variant.name ?? null,
      price: variant.price,
      weight: variant.weight ?? null,
      isAvailable: variant.isAvailable ?? true,
      sortOrder,
    }));
  }

  createForNewProduct(
    variants: readonly ProductVariantWrite[]
  ): Prisma.ProductVariantUncheckedCreateWithoutProductInput[] {
    return variants.map((variant) => ({
      name: variant.name,
      price: variant.price,
      weight: variant.weight,
      isAvailable: variant.isAvailable,
      sortOrder: variant.sortOrder,
    }));
  }

  createForExistingProduct(
    restaurantId: string,
    variants: readonly ProductVariantWrite[]
  ): Prisma.ProductVariantCreateWithoutProductInput[] {
    return variants.map((variant) => ({
      restaurant: { connect: { id: restaurantId } },
      name: variant.name,
      price: variant.price,
      weight: variant.weight,
      isAvailable: variant.isAvailable,
      sortOrder: variant.sortOrder,
    }));
  }
}

export const productVariantService = new ProductVariantService();
