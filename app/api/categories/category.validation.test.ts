import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  categoryListQuerySchema,
  categoryPathParamsSchema,
  createCategoryRequestSchema,
  updateCategoryRequestSchema,
} from "./category.validation";

describe("category request validation", () => {
  it("applies default category list pagination", async () => {
    assert.deepEqual(await categoryListQuerySchema.validate({}), {
      page: 1,
      limit: 10,
    });
  });

  it("casts valid category list query strings to numbers", async () => {
    assert.deepEqual(
      await categoryListQuerySchema.validate({ page: "2", limit: "25" }),
      { page: 2, limit: 25 },
    );
  });

  it("rejects invalid category list pagination", async () => {
    await assert.rejects(
      categoryListQuerySchema.validate({ page: "0", limit: "101" }),
    );
  });

  it("normalizes category input and strips tenant identifiers", async () => {
    const result = await createCategoryRequestSchema.validate(
      {
        name: "  Пицца  ",
        sortOrder: 10,
        isPublished: true,
        restaurantId: "untrusted-restaurant-id",
      },
      { stripUnknown: true },
    );

    assert.deepEqual(result, {
      name: "Пицца",
      sortOrder: 10,
      isPublished: true,
    });
  });

  it("rejects a negative or fractional sort order", async () => {
    for (const sortOrder of [-1, 1.5]) {
      await assert.rejects(
        createCategoryRequestSchema.validate({ name: "Пицца", sortOrder }),
      );
    }
  });

  it("rejects an empty update", async () => {
    await assert.rejects(updateCategoryRequestSchema.validate({}));
  });

  it("accepts a publication update", async () => {
    assert.deepEqual(
      await updateCategoryRequestSchema.validate({ isPublished: false }),
      { isPublished: false },
    );
  });

  it("requires a category id in route params", async () => {
    await assert.rejects(
      categoryPathParamsSchema.validate({ categoryId: " " }),
    );
  });
});
