import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createRestaurantRequestSchema,
  restaurantPathParamsSchema,
  updateRestaurantRequestSchema,
} from "./restaurant.validation";

describe("restaurant request validation", () => {
  it("normalizes a valid create request", async () => {
    const result = await createRestaurantRequestSchema.validate({
      name: "  Pizza Place  ",
      slug: "  PIZZA-PLACE  ",
      unknown: "removed by the route validator",
    });

    assert.equal(result.name, "Pizza Place");
    assert.equal(result.slug, "pizza-place");
  });

  it("rejects an invalid slug", async () => {
    await assert.rejects(
      createRestaurantRequestSchema.validate({
        name: "Pizza Place",
        slug: "pizza place",
      }),
    );
  });

  it("rejects an empty update", async () => {
    await assert.rejects(updateRestaurantRequestSchema.validate({}));
  });

  it("accepts a supported status update", async () => {
    const result = await updateRestaurantRequestSchema.validate({
      status: "SUSPENDED",
    });

    assert.equal(result.status, "SUSPENDED");
  });

  it("requires a restaurant id in route params", async () => {
    await assert.rejects(
      restaurantPathParamsSchema.validate({ restaurantId: " " }),
    );
  });
});
