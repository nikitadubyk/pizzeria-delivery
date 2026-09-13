import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ProductVariantService } from "./product-variant.service";

describe("ProductVariantService", () => {
  it("prepares simple and named variants in display order", () => {
    const service = new ProductVariantService();

    assert.deepEqual(
      service.prepareForCreate([
        { price: 15_000 },
        {
          name: "Большой",
          price: 25_000,
          weight: "400 мл",
          isAvailable: false,
        },
      ]),
      [
        {
          name: null,
          price: 15_000,
          weight: null,
          isAvailable: true,
          sortOrder: 0,
        },
        {
          name: "Большой",
          price: 25_000,
          weight: "400 мл",
          isAvailable: false,
          sortOrder: 1,
        },
      ],
    );
  });

  it("keeps existing ids while preparing a replacement", () => {
    const service = new ProductVariantService();

    assert.equal(
      service.prepareForUpdate([
        { id: "variant-id", name: "30 см", price: 57_900 },
      ])[0].id,
      "variant-id",
    );
  });

  it("uses the checked restaurant relation when adding to an existing product", () => {
    const service = new ProductVariantService();
    const [variant] = service.createForExistingProduct("restaurant-id", [
      {
        name: "44 см",
        price: 79_900,
        weight: "900 г",
        isAvailable: true,
        sortOrder: 1,
      },
    ]);

    assert.deepEqual(variant.restaurant, {
      connect: { id: "restaurant-id" },
    });
    assert.equal("restaurantId" in variant, false);
  });

  it("uses the restaurant scalar when creating variants with a new product", () => {
    const service = new ProductVariantService();
    const [variant] = service.createForNewProduct("restaurant-id", [
      {
        price: 57_900,
        sortOrder: 0,
      },
    ]);

    assert.equal(variant.restaurantId, "restaurant-id");
    assert.equal("restaurant" in variant, false);
  });
});
