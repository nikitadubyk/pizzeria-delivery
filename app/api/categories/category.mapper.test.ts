import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Category } from "@/app/generated/prisma/client";

import { toCategoryDto } from "./category.mapper";

describe("toCategoryDto", () => {
  it("serializes dates and keeps category fields", () => {
    const category: Category = {
      id: "category-id",
      restaurantId: "restaurant-id",
      name: "Пицца",
      sortOrder: 10,
      isPublished: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    assert.deepEqual(toCategoryDto(category), {
      id: "category-id",
      restaurantId: "restaurant-id",
      name: "Пицца",
      sortOrder: 10,
      isPublished: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });
});
