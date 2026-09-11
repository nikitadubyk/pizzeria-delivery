import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { InternalAxiosRequestConfig } from "axios";

import { setRestaurantToken } from "@/store/slices/restaurant-auth.slice";
import { makeStore } from "@/store/store";

import { categoriesApi } from "./categories.api";
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

const category = {
  id: "category-id",
  restaurantId: "restaurant-id",
  name: "Пицца",
  sortOrder: 0,
  isPublished: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("category RTK Query API", () => {
  it("loads a paginated category list with the restaurant token", async () => {
    const store = makeStore();
    const calls: InternalAxiosRequestConfig[] = [];
    store.dispatch(setRestaurantToken("restaurant-token"));
    restaurantClient.defaults.adapter = async (config) => {
      calls.push(config);
      return response(config, {
        items: [category],
        pagination: { page: 2, limit: 10, total: 11, totalPages: 2 },
      });
    };

    try {
      const result = await store
        .dispatch(
          categoriesApi.endpoints.getCategories.initiate({
            page: 2,
            limit: 10,
          }),
        )
        .unwrap();

      assert.equal(result.items[0].name, "Пицца");
      assert.equal(calls[0].url, "/admin/categories");
      assert.equal(calls[0].method, "get");
      assert.deepEqual(calls[0].params, { page: 2, limit: 10 });
      assert.equal(
        calls[0].headers.get("Authorization"),
        "Bearer restaurant-token",
      );
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });

  it("creates, reads, updates, and deletes a category", async () => {
    const store = makeStore();
    const calls: InternalAxiosRequestConfig[] = [];
    store.dispatch(setRestaurantToken("restaurant-token"));
    restaurantClient.defaults.adapter = async (config) => {
      calls.push(config);
      return response(config, category);
    };

    try {
      await store
        .dispatch(
          categoriesApi.endpoints.createCategory.initiate({
            name: "Пицца",
            sortOrder: 0,
            isPublished: false,
          }),
        )
        .unwrap();
      const categoryRequest = store.dispatch(
        categoriesApi.endpoints.getCategory.initiate({
          categoryId: "category-id",
        }),
      );
      await categoryRequest.unwrap();
      categoryRequest.unsubscribe();
      await store
        .dispatch(
          categoriesApi.endpoints.updateCategory.initiate({
            categoryId: "category-id",
            data: { isPublished: true },
          }),
        )
        .unwrap();
      await store
        .dispatch(
          categoriesApi.endpoints.deleteCategory.initiate({
            categoryId: "category-id",
          }),
        )
        .unwrap();

      assert.deepEqual(
        calls.map(({ method, url }) => [method, url]),
        [
          ["post", "/admin/categories"],
          ["get", "/admin/categories/category-id"],
          ["patch", "/admin/categories/category-id"],
          ["delete", "/admin/categories/category-id"],
        ],
      );
      assert.deepEqual(JSON.parse(calls[0].data as string), {
        name: "Пицца",
        sortOrder: 0,
        isPublished: false,
      });
      assert.deepEqual(JSON.parse(calls[2].data as string), {
        isPublished: true,
      });
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });
});
