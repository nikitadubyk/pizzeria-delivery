import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HttpStatus } from "@/app/api/common/api-response";
import { Prisma, type Ingredient } from "@/app/generated/prisma/client";

import {
  IngredientService,
  IngredientServiceError,
  type IngredientRepository,
} from "./ingredient.service";

const createIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  id: "ingredient-id",
  restaurantId: "restaurant-id",
  name: "Моцарелла",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  ...overrides,
});

const createRepository = (
  overrides: Partial<IngredientRepository> = {}
): IngredientRepository => ({
  findPage: async () => ({ items: [], total: 0 }),
  findOptions: async () => [],
  findById: async () => null,
  create: async (_restaurantId, data) => createIngredient(data),
  update: async (_restaurantId, _ingredientId, data) => createIngredient(data),
  delete: async () => createIngredient(),
  ...overrides,
});

const prismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError("Repository error", {
    code,
    clientVersion: "test",
  });

describe("IngredientService", () => {
  it("returns a tenant-scoped page and all select options", async () => {
    const ingredients = [createIngredient()];
    const service = new IngredientService(
      createRepository({
        findPage: async (restaurantId, query) => {
          assert.equal(restaurantId, "restaurant-id");
          assert.deepEqual(query, { page: 2, limit: 10 });
          return { items: ingredients, total: 11 };
        },
        findOptions: async (restaurantId) => {
          assert.equal(restaurantId, "restaurant-id");
          return ingredients;
        },
      })
    );

    assert.deepEqual(
      await service.getPage("restaurant-id", { page: 2, limit: 10 }),
      { items: ingredients, total: 11 }
    );
    assert.deepEqual(await service.getOptions("restaurant-id"), ingredients);
  });

  it("returns not found for an ingredient outside the restaurant", async () => {
    const service = new IngredientService(createRepository());

    await assert.rejects(
      service.getById("restaurant-id", "other-restaurant-ingredient"),
      (error: unknown) =>
        error instanceof IngredientServiceError &&
        error.status === HttpStatus.NOT_FOUND
    );
  });

  it("passes the authenticated restaurant to mutations", async () => {
    const calls: string[] = [];
    const service = new IngredientService(
      createRepository({
        create: async (restaurantId, data) => {
          calls.push(`create:${restaurantId}`);
          return createIngredient(data);
        },
        update: async (restaurantId, ingredientId, data) => {
          calls.push(`update:${restaurantId}:${ingredientId}`);
          return createIngredient(data);
        },
        delete: async (restaurantId, ingredientId) => {
          calls.push(`delete:${restaurantId}:${ingredientId}`);
          return createIngredient();
        },
      })
    );

    await service.create("restaurant-id", { name: "Моцарелла" });
    await service.update("restaurant-id", "ingredient-id", {
      name: "Сыр моцарелла",
    });
    await service.delete("restaurant-id", "ingredient-id");

    assert.deepEqual(calls, [
      "create:restaurant-id",
      "update:restaurant-id:ingredient-id",
      "delete:restaurant-id:ingredient-id",
    ]);
  });

  it("maps missing and referenced records to domain errors", async () => {
    const missingService = new IngredientService(
      createRepository({
        update: async () => {
          throw prismaError("P2025");
        },
      })
    );
    const referencedService = new IngredientService(
      createRepository({
        delete: async () => {
          throw prismaError("P2003");
        },
      })
    );

    await assert.rejects(
      missingService.update("restaurant-id", "missing-id", { name: "Сыр" }),
      (error: unknown) =>
        error instanceof IngredientServiceError &&
        error.status === HttpStatus.NOT_FOUND
    );
    await assert.rejects(
      referencedService.delete("restaurant-id", "ingredient-id"),
      (error: unknown) =>
        error instanceof IngredientServiceError &&
        error.status === HttpStatus.CONFLICT
    );
  });
});
