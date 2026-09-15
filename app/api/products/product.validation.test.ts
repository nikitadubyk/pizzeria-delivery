import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createProductRequestSchema,
  productListQuerySchema,
  updateProductAvailabilityRequestSchema,
  updateProductRequestSchema,
} from "./product.validation";

describe("product request validation", () => {
  it("normalizes product input and strips tenant fields", async () => {
    const result = await createProductRequestSchema.validate(
      {
        categoryId: " category-id ",
        name: " Маргарита ",
        description: " ",
        baseComposition: " Тесто, соус, сыр ",
        sortOrder: 10,
        isPublished: true,
        variants: [
          {
            name: " 30 см ",
            price: 57_900,
            weight: " 520 г ",
            isAvailable: true,
            restaurantId: "untrusted-restaurant-id",
          },
        ],
        restaurantId: "untrusted-restaurant-id",
        imageKey: "untrusted-key",
      },
      { stripUnknown: true },
    );

    assert.deepEqual(result, {
      categoryId: "category-id",
      name: "Маргарита",
      description: null,
      baseComposition: "Тесто, соус, сыр",
      sortOrder: 10,
      isPublished: true,
      variants: [
        {
          name: "30 см",
          price: 57_900,
          weight: "520 г",
          isAvailable: true,
        },
      ],
    });
  });

  it("applies list defaults and casts filters", async () => {
    assert.deepEqual(
      await productListQuerySchema.validate({ isPublished: "false" }),
      { page: 1, limit: 20, isPublished: false },
    );
  });

  it("accepts null to remove optional product content", async () => {
    assert.deepEqual(
      await updateProductRequestSchema.validate({
        description: null,
      }),
      { description: null },
    );
  });

  it("accepts only the availability flag for stop-list updates", async () => {
    assert.deepEqual(
      await updateProductAvailabilityRequestSchema.validate(
        {
          isAvailable: false,
          name: "Подменённое название",
          price: 1,
          restaurantId: "other-restaurant",
        },
        { stripUnknown: true },
      ),
      { isAvailable: false },
    );
    await assert.rejects(
      updateProductAvailabilityRequestSchema.validate({}),
    );
  });

  it("normalizes a list search", async () => {
    assert.deepEqual(
      await productListQuerySchema.validate({ search: "  сыр  " }),
      { page: 1, limit: 20, search: "сыр" },
    );
  });

  it("rejects empty updates and invalid sort order", async () => {
    await assert.rejects(updateProductRequestSchema.validate({}));
    await assert.rejects(
      createProductRequestSchema.validate({
        categoryId: "category-id",
        name: "Маргарита",
        sortOrder: -1,
        variants: [{ price: 57_900 }],
      }),
    );
  });

  it("accepts an empty variant list and requires integer prices in kopecks", async () => {
    assert.deepEqual(
      await createProductRequestSchema.validate({
        categoryId: "category-id",
        name: "Маргарита",
        variants: [],
      }),
      {
        categoryId: "category-id",
        name: "Маргарита",
        variants: [],
      },
    );
    await assert.rejects(
      createProductRequestSchema.validate({
        categoryId: "category-id",
        name: "Маргарита",
        variants: [{ price: 57_900.5 }],
      }),
    );
  });

  it("requires names when a product has multiple variants", async () => {
    await assert.rejects(
      createProductRequestSchema.validate({
        categoryId: "category-id",
        name: "Маргарита",
        variants: [{ price: 49_900 }, { name: "30 см", price: 57_900 }],
      }),
    );
  });
});
