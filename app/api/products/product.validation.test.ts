import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createProductRequestSchema,
  productListQuerySchema,
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
      }),
    );
  });
});
