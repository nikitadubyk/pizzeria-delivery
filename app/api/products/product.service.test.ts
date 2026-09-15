import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HttpStatus } from "@/app/api/common/api-response";
import type { Product } from "@/app/generated/prisma/client";
import type { ProductWithCategory } from "./types";

import {
  ProductService,
  ProductServiceError,
  type ProductImageStorage,
  type ProductRepository,
} from "./product.service";

const createProduct = (
  overrides: Partial<Product> = {},
): ProductWithCategory => ({
  id: "product-id",
  restaurantId: "restaurant-id",
  categoryId: "category-id",
  name: "Маргарита",
  description: null,
  baseComposition: "Тесто, томаты, моцарелла",
  imageUrl: null,
  imageKey: null,
  sortOrder: 10,
  isPublished: false,
  isAvailable: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  category: { id: "category-id", name: "Пицца" },
  variants: [],
  ...overrides,
});

const createRepository = (
  overrides: Partial<ProductRepository> = {},
): ProductRepository => ({
  findPage: async () => ({ items: [], total: 0 }),
  findById: async () => createProduct(),
  categoryExists: async () => true,
  create: async (_restaurantId, data) => createProduct(data),
  update: async (_restaurantId, _productId, data) => createProduct(data),
  updateAvailability: async (_restaurantId, _productId, isAvailable) =>
    createProduct({ isAvailable }),
  delete: async () => createProduct(),
  ...overrides,
});

const createImageStorage = (
  overrides: Partial<ProductImageStorage> = {},
): ProductImageStorage => ({
  delete: async () => undefined,
  deleteMany: async () => undefined,
  ...overrides,
});

describe("ProductService", () => {
  it("rejects a category outside the authenticated restaurant", async () => {
    const service = new ProductService(
      createRepository({ categoryExists: async () => false }),
      createImageStorage(),
    );

    await assert.rejects(
      service.create("restaurant-id", {
        categoryId: "other-restaurant-category",
        name: "Маргарита",
        variants: [{ price: 57_900 }],
      }),
      (error: unknown) =>
        error instanceof ProductServiceError &&
        error.status === HttpStatus.BAD_REQUEST,
    );
  });

  it("creates a product without handling image bytes", async () => {
    const calls: string[] = [];
    const service = new ProductService(
      createRepository({
        create: async (restaurantId, data, variants) => {
          calls.push(
            `create:${restaurantId}:${data.name}:${variants[0].price}:${variants[0].sortOrder}`,
          );
          return createProduct(data);
        },
      }),
      createImageStorage(),
    );

    const product = await service.create("restaurant-id", {
      categoryId: "category-id",
      name: "Маргарита",
      variants: [{ price: 57_900 }],
    });

    assert.equal(product.imageKey, null);
    assert.deepEqual(calls, ["create:restaurant-id:Маргарита:57900:0"]);
  });

  it("preserves variant ids and derives their order during update", async () => {
    const calls: string[] = [];
    const service = new ProductService(
      createRepository({
        update: async (_restaurantId, _productId, _data, variants) => {
          calls.push(
            variants
              ?.map(
                (variant) =>
                  `${variant.id ?? "new"}:${variant.name}:${variant.sortOrder}`,
              )
              .join(",") ?? "unchanged",
          );
          return createProduct();
        },
      }),
      createImageStorage(),
    );

    await service.update("restaurant-id", "product-id", {
      variants: [
        { id: "variant-30", name: "30 см", price: 57_900 },
        { name: "40 см", price: 79_900 },
      ],
    });

    assert.deepEqual(calls, ["variant-30:30 см:0,new:40 см:1"]);
  });

  it("passes an empty variant list through so all variants can be removed", async () => {
    let receivedVariantCount: number | undefined;
    const service = new ProductService(
      createRepository({
        update: async (_restaurantId, _productId, _data, variants) => {
          receivedVariantCount = variants?.length;
          return createProduct();
        },
      }),
      createImageStorage(),
    );

    await service.update("restaurant-id", "product-id", { variants: [] });

    assert.equal(receivedVariantCount, 0);
  });

  it("updates only product availability inside the authenticated restaurant", async () => {
    const calls: unknown[][] = [];
    const service = new ProductService(
      createRepository({
        updateAvailability: async (
          restaurantId,
          productId,
          isAvailable,
        ) => {
          calls.push([restaurantId, productId, isAvailable]);
          return createProduct({ isAvailable });
        },
      }),
      createImageStorage(),
    );

    const product = await service.updateAvailability(
      "restaurant-id",
      "product-id",
      false,
    );

    assert.equal(product.isAvailable, false);
    assert.deepEqual(calls, [["restaurant-id", "product-id", false]]);
  });

  it("attaches an uploaded image before deleting the previous one", async () => {
    const calls: string[] = [];
    const service = new ProductService(
      createRepository({
        findById: async () =>
          createProduct({
            imageUrl: "https://ufs.sh/f/old-image-key",
            imageKey: "old-image-key",
          }),
        update: async (restaurantId, productId, data) => {
          calls.push(`update:${restaurantId}:${productId}:${data.imageKey}`);
          return createProduct(data);
        },
      }),
      createImageStorage({
        delete: async (key) => {
          calls.push(`delete:${key}`);
        },
      }),
    );

    const product = await service.attachUploadedImage(
      "restaurant-id",
      "product-id",
      {
        key: "new-image-key",
        url: "https://ufs.sh/f/new-image-key",
      },
    );

    assert.equal(product.imageKey, "new-image-key");
    assert.deepEqual(calls, [
      "update:restaurant-id:product-id:new-image-key",
      "delete:old-image-key",
    ]);
  });

  it("deletes a just-uploaded image if persisting its URL fails", async () => {
    const deletedKeys: string[] = [];
    const service = new ProductService(
      createRepository({
        update: async () => {
          throw new Error("database unavailable");
        },
      }),
      createImageStorage({
        delete: async (key) => {
          deletedKeys.push(key);
        },
      }),
    );

    await assert.rejects(
      service.attachUploadedImage("restaurant-id", "product-id", {
        key: "new-image-key",
        url: "https://ufs.sh/f/new-image-key",
      }),
    );
    assert.deepEqual(deletedKeys, ["new-image-key"]);
  });

  it("deletes an uploaded image if the product disappeared before callback", async () => {
    const deletedKeys: string[] = [];
    const service = new ProductService(
      createRepository({ findById: async () => null }),
      createImageStorage({
        delete: async (key) => {
          deletedKeys.push(key);
        },
      }),
    );

    await assert.rejects(
      service.attachUploadedImage("restaurant-id", "missing-product", {
        key: "orphan-image-key",
        url: "https://ufs.sh/f/orphan-image-key",
      }),
      (error: unknown) =>
        error instanceof ProductServiceError &&
        error.status === HttpStatus.NOT_FOUND,
    );
    assert.deepEqual(deletedKeys, ["orphan-image-key"]);
  });

  it("deletes a managed image after deleting the product", async () => {
    const deletedKeys: string[] = [];
    const service = new ProductService(
      createRepository({
        delete: async () => createProduct({ imageKey: "old-image-key" }),
      }),
      createImageStorage({
        delete: async (key) => {
          deletedKeys.push(key);
        },
      }),
    );

    await service.delete("restaurant-id", "product-id");
    assert.deepEqual(deletedKeys, ["old-image-key"]);
  });

  it("clears a managed image before deleting it from storage", async () => {
    const calls: string[] = [];
    const service = new ProductService(
      createRepository({
        findById: async () =>
          createProduct({
            imageUrl: "https://ufs.sh/f/old-image-key",
            imageKey: "old-image-key",
          }),
        update: async (_restaurantId, _productId, data) => {
          calls.push(
            `update:${String(data.imageUrl)}:${String(data.imageKey)}`,
          );
          return createProduct(data);
        },
      }),
      createImageStorage({
        delete: async (key) => {
          calls.push(`delete:${key}`);
        },
      }),
    );

    const product = await service.removeImage("restaurant-id", "product-id");

    assert.equal(product.imageUrl, null);
    assert.equal(product.imageKey, null);
    assert.deepEqual(calls, ["update:null:null", "delete:old-image-key"]);
  });
});
