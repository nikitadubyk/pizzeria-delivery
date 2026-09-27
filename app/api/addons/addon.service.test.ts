import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Addon } from "@/app/generated/prisma/client";
import { AddonService } from "./addon.service";
import type { AddonRepository } from "./types";

const addon: Addon = {
  id: "addon-a",
  restaurantId: "restaurant-a",
  name: "Моцарелла",
  price: 12900,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function repository(overrides: Partial<AddonRepository> = {}): AddonRepository {
  return {
    findPage: async () => ({ items: [addon], total: 1 }),
    findOptions: async () => [addon],
    findById: async () => addon,
    create: async () => addon,
    update: async () => addon,
    updateAvailability: async () => addon,
    delete: async () => addon,
    ...overrides,
  };
}

describe("AddonService", () => {
  it("passes the authenticated restaurant to list and every mutation", async () => {
    const calls: string[] = [];
    const service = new AddonService(
      repository({
        findPage: async (restaurantId, query) => {
          calls.push(`list:${restaurantId}:${query.page}:${query.limit}`);
          return { items: [addon], total: 1 };
        },
        findOptions: async (restaurantId) => {
          calls.push(`options:${restaurantId}`);
          return [addon];
        },
        findById: async (restaurantId, addonId) => {
          calls.push(`get:${restaurantId}:${addonId}`);
          return addon;
        },
        create: async (restaurantId, data) => {
          calls.push(`create:${restaurantId}:${data.price}`);
          return addon;
        },
        update: async (restaurantId, addonId, data) => {
          calls.push(`update:${restaurantId}:${addonId}:${data.name}`);
          return addon;
        },
        updateAvailability: async (restaurantId, addonId, value) => {
          calls.push(`availability:${restaurantId}:${addonId}:${value}`);
          return addon;
        },
        delete: async (restaurantId, addonId) => {
          calls.push(`delete:${restaurantId}:${addonId}`);
          return addon;
        },
      })
    );
    await service.getPage("restaurant-a", { page: 2, limit: 10 });
    await service.getOptions("restaurant-a");
    await service.getById("restaurant-a", "addon-a");
    await service.create("restaurant-a", { name: "Моцарелла", price: 12900 });
    await service.update("restaurant-a", "addon-a", { name: "Сыр" });
    await service.updateAvailability("restaurant-a", "addon-a", false);
    await service.delete("restaurant-a", "addon-a");
    assert.deepEqual(calls, [
      "list:restaurant-a:2:10",
      "options:restaurant-a",
      "get:restaurant-a:addon-a",
      "create:restaurant-a:12900",
      "update:restaurant-a:addon-a:Сыр",
      "availability:restaurant-a:addon-a:false",
      "delete:restaurant-a:addon-a",
    ]);
  });

  it("does not return an add-on from another restaurant", async () => {
    const service = new AddonService(
      repository({ findById: async () => null })
    );
    await assert.rejects(service.getById("restaurant-b", "addon-a"), {
      status: 404,
    });
  });
});
