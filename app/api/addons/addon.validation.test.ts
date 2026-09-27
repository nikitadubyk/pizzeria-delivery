import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addonListQuerySchema,
  createAddonRequestSchema,
  updateAddonAvailabilityRequestSchema,
  updateAddonRequestSchema,
} from "./addon.validation";

describe("addon request validation", () => {
  it("applies pagination defaults and normalizes search", async () => {
    assert.deepEqual(
      await addonListQuerySchema.validate({ search: "  сыр  " }),
      {
        page: 1,
        limit: 10,
        search: "сыр",
      }
    );
    await assert.rejects(
      addonListQuerySchema.validate({ page: 0, limit: 101 })
    );
  });

  it("accepts positive integer kopecks and strips tenant input", async () => {
    assert.deepEqual(
      await createAddonRequestSchema.validate(
        {
          name: "  Моцарелла  ",
          price: 12900,
          isAvailable: true,
          restaurantId: "other-restaurant",
        },
        { stripUnknown: true }
      ),
      {
        name: "Моцарелла",
        price: 12900,
        isAvailable: true,
      }
    );
    for (const price of [0, -1, 12.5, 2_147_483_648]) {
      await assert.rejects(
        createAddonRequestSchema.validate({ name: "Сыр", price })
      );
    }
  });

  it("rejects empty edits and limits availability updates to one flag", async () => {
    await assert.rejects(updateAddonRequestSchema.validate({}));
    assert.deepEqual(
      await updateAddonAvailabilityRequestSchema.validate(
        {
          isAvailable: false,
          price: 1,
          restaurantId: "other-restaurant",
        },
        { stripUnknown: true }
      ),
      { isAvailable: false }
    );
  });
});
