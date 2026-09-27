import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createIngredientRequestSchema,
  ingredientListQuerySchema,
  ingredientPathParamsSchema,
  updateIngredientRequestSchema,
} from "./ingredient.validation";

describe("ingredient request validation", () => {
  it("applies pagination defaults and normalizes search", async () => {
    assert.deepEqual(
      await ingredientListQuerySchema.validate({ search: "  сыр  " }),
      { page: 1, limit: 10, search: "сыр" }
    );
  });

  it("normalizes ingredient input and strips tenant fields", async () => {
    assert.deepEqual(
      await createIngredientRequestSchema.validate(
        {
          name: "  Моцарелла  ",
          restaurantId: "untrusted-restaurant-id",
        },
        { stripUnknown: true }
      ),
      { name: "Моцарелла" }
    );
  });

  it("rejects empty updates and blank route params", async () => {
    await assert.rejects(updateIngredientRequestSchema.validate({}));
    await assert.rejects(
      ingredientPathParamsSchema.validate({ ingredientId: " " })
    );
  });
});
