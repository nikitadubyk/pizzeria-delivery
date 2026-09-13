import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toProductDto } from "./product.mapper";
import type { ProductWithCategory } from "./types";

describe("toProductDto", () => {
  it("serializes public product fields without exposing the storage key", () => {
    const product: ProductWithCategory = {
      id: "product-id",
      restaurantId: "restaurant-id",
      categoryId: "category-id",
      name: "Маргарита",
      description: "Классическая пицца",
      baseComposition: "Тесто, томаты, моцарелла",
      imageUrl: "https://example.com/pizza.webp",
      imageKey: "private-uploadthing-key",
      sortOrder: 10,
      isPublished: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
      category: { id: "category-id", name: "Пицца" },
      variants: [
        {
          id: "variant-id",
          restaurantId: "restaurant-id",
          productId: "product-id",
          name: "30 см",
          price: 57_900,
          weight: "520 г",
          isAvailable: true,
          sortOrder: 0,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ],
    };

    assert.deepEqual(toProductDto(product), {
      id: "product-id",
      restaurantId: "restaurant-id",
      categoryId: "category-id",
      category: { id: "category-id", name: "Пицца" },
      name: "Маргарита",
      description: "Классическая пицца",
      baseComposition: "Тесто, томаты, моцарелла",
      imageUrl: "https://example.com/pizza.webp",
      sortOrder: 10,
      isPublished: true,
      variants: [
        {
          id: "variant-id",
          name: "30 см",
          price: 57_900,
          weight: "520 г",
          isAvailable: true,
          sortOrder: 0,
        },
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });
});
