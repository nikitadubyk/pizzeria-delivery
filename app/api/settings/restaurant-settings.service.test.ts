import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HttpStatus } from "@/app/api/common/api-response";

import {
  RestaurantSettingsService,
  RestaurantSettingsServiceError,
  type RestaurantSettingsRepository,
} from "./restaurant-settings.service";

const createRepository = (
  overrides: Partial<RestaurantSettingsRepository> = {},
): RestaurantSettingsRepository => ({
  find: async () => ({ deliveryPrice: 0 }),
  update: async (_restaurantId, data) => data,
  ...overrides,
});

describe("RestaurantSettingsService", () => {
  it("loads settings for the authenticated restaurant", async () => {
    const service = new RestaurantSettingsService(
      createRepository({
        find: async (restaurantId) => {
          assert.equal(restaurantId, "restaurant-id");
          return { deliveryPrice: 30_000 };
        },
      }),
    );

    assert.deepEqual(await service.get("restaurant-id"), {
      deliveryPrice: 30_000,
    });
  });

  it("updates settings only for the authenticated restaurant", async () => {
    const service = new RestaurantSettingsService(
      createRepository({
        update: async (restaurantId, data) => {
          assert.equal(restaurantId, "restaurant-id");
          assert.deepEqual(data, { deliveryPrice: 45_000 });
          return data;
        },
      }),
    );

    assert.deepEqual(
      await service.update("restaurant-id", { deliveryPrice: 45_000 }),
      { deliveryPrice: 45_000 },
    );
  });

  it("returns not found when the scoped restaurant is missing", async () => {
    const service = new RestaurantSettingsService(
      createRepository({ find: async () => null }),
    );

    await assert.rejects(
      service.get("restaurant-id"),
      (error: unknown) =>
        error instanceof RestaurantSettingsServiceError &&
        error.status === HttpStatus.NOT_FOUND,
    );
  });
});
