import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Ingredient } from "@/app/generated/prisma/client";

import { toIngredientDto } from "./ingredient.mapper";

describe("toIngredientDto", () => {
  it("serializes dates and keeps ingredient fields", () => {
    const ingredient: Ingredient = {
      id: "ingredient-id",
      restaurantId: "restaurant-id",
      name: "Моцарелла",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    assert.deepEqual(toIngredientDto(ingredient), {
      id: "ingredient-id",
      restaurantId: "restaurant-id",
      name: "Моцарелла",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });
});
