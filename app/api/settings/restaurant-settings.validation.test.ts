import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DELIVERY_PRICE_MAX } from "@/api-contracts";

import { updateRestaurantSettingsRequestSchema } from "./restaurant-settings.validation";

describe("restaurant settings request validation", () => {
  it("accepts an integer delivery price in kopecks and strips unknown fields", async () => {
    assert.deepEqual(
      await updateRestaurantSettingsRequestSchema.validate(
        {
          deliveryPrice: 30_000,
          restaurantId: "untrusted-restaurant-id",
        },
        { stripUnknown: true },
      ),
      { deliveryPrice: 30_000 },
    );
  });

  it("accepts free delivery", async () => {
    assert.deepEqual(
      await updateRestaurantSettingsRequestSchema.validate({
        deliveryPrice: 0,
      }),
      { deliveryPrice: 0 },
    );
  });

  it("rejects missing, negative, fractional, and overflowing prices", async () => {
    for (const value of [undefined, -1, 100.5, DELIVERY_PRICE_MAX + 1]) {
      await assert.rejects(
        updateRestaurantSettingsRequestSchema.validate({
          deliveryPrice: value,
        }),
      );
    }
  });
});
