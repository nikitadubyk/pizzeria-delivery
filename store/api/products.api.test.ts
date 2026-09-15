import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { InternalAxiosRequestConfig } from "axios";

import { setRestaurantToken } from "@/store/slices/restaurant-auth.slice";
import { makeStore } from "@/store/store";

import { productsApi } from "./products.api";
import { restaurantAuthApi, restaurantClient } from "./restaurant-auth.api";

const originalAdapter = restaurantClient.defaults.adapter;

afterEach(() => {
  restaurantClient.defaults.adapter = originalAdapter;
});

const response = (config: InternalAxiosRequestConfig, data: unknown) => ({
  config,
  data,
  status: 200,
  statusText: "OK",
  headers: {},
});

const product = {
  id: "product-id",
  restaurantId: "restaurant-id",
  categoryId: "category-id",
  category: { id: "category-id", name: "Пицца" },
  name: "Маргарита",
  description: "Томатный соус и сыр",
  baseComposition: "Моцарелла, томаты",
  imageUrl: null,
  sortOrder: 0,
  isPublished: false,
  isAvailable: true,
  variants: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("product RTK Query API", () => {
  it("loads a searched product page with the restaurant token", async () => {
    const store = makeStore();
    const calls: InternalAxiosRequestConfig[] = [];
    store.dispatch(setRestaurantToken("restaurant-token"));
    restaurantClient.defaults.adapter = async (config) => {
      calls.push(config);
      return response(config, {
        items: [product],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
    };

    try {
      const result = await store
        .dispatch(
          productsApi.endpoints.getProducts.initiate({
            page: 1,
            limit: 20,
            search: "маргарита",
          }),
        )
        .unwrap();

      assert.equal(result.items[0].name, "Маргарита");
      assert.equal(calls[0].url, "/admin/products");
      assert.deepEqual(calls[0].params, {
        page: 1,
        limit: 20,
        search: "маргарита",
      });
      assert.equal(
        calls[0].headers.get("Authorization"),
        "Bearer restaurant-token",
      );
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });

  it("creates, reads, updates, and deletes a product", async () => {
    const store = makeStore();
    const calls: InternalAxiosRequestConfig[] = [];
    store.dispatch(setRestaurantToken("restaurant-token"));
    restaurantClient.defaults.adapter = async (config) => {
      calls.push(config);
      return response(config, product);
    };

    try {
      await store
        .dispatch(
          productsApi.endpoints.createProduct.initiate({
            categoryId: "category-id",
            name: "Маргарита",
            variants: [{ price: 57_900 }],
          }),
        )
        .unwrap();
      const productRequest = store.dispatch(
        productsApi.endpoints.getProduct.initiate({ productId: "product-id" }),
      );
      await productRequest.unwrap();
      productRequest.unsubscribe();
      await store
        .dispatch(
          productsApi.endpoints.updateProduct.initiate({
            productId: "product-id",
            data: { isPublished: true },
          }),
        )
        .unwrap();
      await store
        .dispatch(
          productsApi.endpoints.updateProductAvailability.initiate({
            productId: "product-id",
            data: { isAvailable: false },
          }),
        )
        .unwrap();
      await store
        .dispatch(
          productsApi.endpoints.removeProductImage.initiate({
            productId: "product-id",
          }),
        )
        .unwrap();
      await store
        .dispatch(
          productsApi.endpoints.deleteProduct.initiate({
            productId: "product-id",
          }),
        )
        .unwrap();

      assert.deepEqual(
        calls.map(({ method, url }) => [method, url]),
        [
          ["post", "/admin/products"],
          ["get", "/admin/products/product-id"],
          ["patch", "/admin/products/product-id"],
          ["patch", "/admin/products/product-id/availability"],
          ["delete", "/admin/products/product-id/image"],
          ["delete", "/admin/products/product-id"],
        ],
      );
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });
});
