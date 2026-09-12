import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HttpStatus } from "@/app/api/common/api-response";
import { Prisma, type Category } from "@/app/generated/prisma/client";
import dayjs from "dayjs";

import {
  CategoryService,
  CategoryServiceError,
  type CategoryRepository,
} from "./category.service";

const createCategory = (overrides: Partial<Category> = {}): Category => ({
  id: "category-id",
  restaurantId: "restaurant-id",
  name: "Пицца",
  sortOrder: 10,
  isPublished: false,
  createdAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  updatedAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  ...overrides,
});

const createRepository = (
  overrides: Partial<CategoryRepository> = {},
): CategoryRepository => ({
  findPage: async () => ({ items: [], total: 0 }),
  findOptions: async () => [],
  findById: async () => null,
  create: async (_restaurantId, data) => createCategory(data),
  update: async (_restaurantId, _categoryId, data) => createCategory(data),
  delete: async () => createCategory(),
  ...overrides,
});

const prismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError("Repository error", {
    code,
    clientVersion: "test",
  });

describe("CategoryService", () => {
  it("returns every category option without pagination", async () => {
    const categories = [createCategory(), createCategory({ id: "drinks" })];
    const service = new CategoryService(
      createRepository({
        findOptions: async (restaurantId) => {
          assert.equal(restaurantId, "restaurant-id");
          return categories;
        },
      }),
    );

    assert.deepEqual(await service.getOptions("restaurant-id"), categories);
  });

  it("returns a category page for the authenticated restaurant", async () => {
    const categories = [createCategory()];
    const service = new CategoryService(
      createRepository({
        findPage: async (restaurantId, pagination) => {
          assert.equal(restaurantId, "restaurant-id");
          assert.deepEqual(pagination, { page: 2, limit: 10 });
          return { items: categories, total: 11 };
        },
      }),
    );

    assert.deepEqual(
      await service.getPage("restaurant-id", { page: 2, limit: 10 }),
      { items: categories, total: 11 },
    );
  });

  it("creates a category in the authenticated restaurant", async () => {
    const service = new CategoryService(
      createRepository({
        create: async (restaurantId, data) => {
          assert.equal(restaurantId, "restaurant-id");
          assert.deepEqual(data, {
            name: "Пицца",
            sortOrder: 10,
            isPublished: true,
          });
          return createCategory(data);
        },
      }),
    );

    const category = await service.create("restaurant-id", {
      name: "Пицца",
      sortOrder: 10,
      isPublished: true,
    });

    assert.equal(category.restaurantId, "restaurant-id");
    assert.equal(category.isPublished, true);
  });

  it("returns not found for a category outside the restaurant scope", async () => {
    const service = new CategoryService(createRepository());

    await assert.rejects(
      service.getById("restaurant-id", "other-restaurant-category"),
      (error: unknown) =>
        error instanceof CategoryServiceError &&
        error.status === HttpStatus.NOT_FOUND,
    );
  });

  it("updates and deletes a category in the authenticated restaurant", async () => {
    const calls: string[] = [];
    const service = new CategoryService(
      createRepository({
        update: async (restaurantId, categoryId, data) => {
          calls.push(`update:${restaurantId}:${categoryId}`);
          return createCategory(data);
        },
        delete: async (restaurantId, categoryId) => {
          calls.push(`delete:${restaurantId}:${categoryId}`);
          return createCategory();
        },
      }),
    );

    const updated = await service.update("restaurant-id", "category-id", {
      isPublished: true,
    });
    const deleted = await service.delete("restaurant-id", "category-id");

    assert.equal(updated.isPublished, true);
    assert.equal(deleted.id, "category-id");
    assert.deepEqual(calls, [
      "update:restaurant-id:category-id",
      "delete:restaurant-id:category-id",
    ]);
  });

  it("maps missing update and delete records to not found", async () => {
    const service = new CategoryService(
      createRepository({
        update: async () => {
          throw prismaError("P2025");
        },
        delete: async () => {
          throw prismaError("P2025");
        },
      }),
    );

    for (const operation of [
      () => service.update("restaurant-id", "missing-id", { name: "Напитки" }),
      () => service.delete("restaurant-id", "missing-id"),
    ]) {
      await assert.rejects(
        operation(),
        (error: unknown) =>
          error instanceof CategoryServiceError &&
          error.status === HttpStatus.NOT_FOUND,
      );
    }
  });

  it("rejects deleting a category that still has products", async () => {
    const service = new CategoryService(
      createRepository({
        delete: async () => {
          throw prismaError("P2003");
        },
      }),
    );

    await assert.rejects(
      service.delete("restaurant-id", "category-id"),
      (error: unknown) =>
        error instanceof CategoryServiceError &&
        error.status === HttpStatus.CONFLICT,
    );
  });
});
