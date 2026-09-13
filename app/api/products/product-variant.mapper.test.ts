import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ProductVariant } from "@/app/generated/prisma/client";

import { toProductVariantDto } from "./product-variant.mapper";

describe("toProductVariantDto", () => {
  it("maps only public product variant fields", () => {
    const variant: ProductVariant = {
      id: "variant-id",
      restaurantId: "restaurant-id",
      productId: "product-id",
      name: "30 см",
      price: 57_900,
      weight: "520 г",
      isAvailable: true,
      sortOrder: 0,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    assert.deepEqual(toProductVariantDto(variant), {
      id: "variant-id",
      name: "30 см",
      price: 57_900,
      weight: "520 г",
      isAvailable: true,
      sortOrder: 0,
    });
  });
});
