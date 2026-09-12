import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Restaurant } from "@/app/generated/prisma/client";
import { HttpStatus } from "@/app/api/common/api-response";
import dayjs from "dayjs";

import {
  RestaurantService,
  RestaurantServiceError,
  type RestaurantRepository,
} from "./restaurant.service";
import type { ProductImageStorage } from "../products/types";

const createRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => ({
  id: "restaurant-id",
  name: "Pizza Place",
  slug: "pizza-place",
  status: "ACTIVE",
  createdAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  updatedAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  ...overrides,
});

const createRepository = (
  overrides: Partial<RestaurantRepository> = {},
): RestaurantRepository => ({
  findPage: async () => ({ items: [], total: 0 }),
  findById: async () => null,
  create: async (_superAdminId, data) => createRestaurant(data),
  update: async (_superAdminId, _restaurantId, data) => createRestaurant(data),
  delete: async () => ({
    restaurant: createRestaurant(),
    productImageKeys: [],
  }),
  ...overrides,
});

describe("RestaurantService", () => {
  it("returns a restaurant page through the super-admin repository", async () => {
    const restaurants = [createRestaurant()];
    const service = new RestaurantService(
      createRepository({
        findPage: async (superAdminId, pagination) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.deepEqual(pagination, { page: 2, limit: 10 });
          return { items: restaurants, total: 11 };
        },
      }),
    );

    assert.deepEqual(
      await service.getPage("super-admin-id", { page: 2, limit: 10 }),
      { items: restaurants, total: 11 },
    );
  });

  it("creates a restaurant with validated input", async () => {
    const service = new RestaurantService(
      createRepository({
        create: async (superAdminId, data) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.deepEqual(data, {
            name: "Pizza Place",
            slug: "pizza-place",
          });
          return createRestaurant(data);
        },
      }),
    );

    const restaurant = await service.create("super-admin-id", {
      name: "Pizza Place",
      slug: "pizza-place",
    });

    assert.equal(restaurant.slug, "pizza-place");
  });

  it("returns not found when a restaurant does not exist", async () => {
    const service = new RestaurantService(createRepository());

    await assert.rejects(
      service.getById("super-admin-id", "missing-id"),
      (error: unknown) =>
        error instanceof RestaurantServiceError &&
        error.status === HttpStatus.NOT_FOUND,
    );
  });

  it("updates only provided restaurant fields", async () => {
    const service = new RestaurantService(
      createRepository({
        update: async (superAdminId, restaurantId, data) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.equal(restaurantId, "restaurant-id");
          assert.deepEqual(data, { status: "SUSPENDED" });
          return createRestaurant(data);
        },
      }),
    );

    const restaurant = await service.update("super-admin-id", "restaurant-id", {
      status: "SUSPENDED",
    });

    assert.equal(restaurant.status, "SUSPENDED");
  });

  it("deletes a restaurant by id", async () => {
    const deletedImageKeys: string[][] = [];
    const service = new RestaurantService(
      createRepository({
        delete: async (superAdminId, restaurantId) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.equal(restaurantId, "restaurant-id");
          return {
            restaurant: createRestaurant(),
            productImageKeys: ["image-one", "image-two"],
          };
        },
      }),
      {
        deleteMany: async (keys) => {
          deletedImageKeys.push([...keys]);
        },
      } satisfies Pick<ProductImageStorage, "deleteMany">,
    );

    assert.equal(
      (await service.delete("super-admin-id", "restaurant-id")).id,
      "restaurant-id",
    );
    assert.deepEqual(deletedImageKeys, [["image-one", "image-two"]]);
  });
});
