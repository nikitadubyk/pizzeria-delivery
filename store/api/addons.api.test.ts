import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { InternalAxiosRequestConfig } from "axios";

import { setRestaurantToken } from "@/store/slices/restaurant-auth.slice";
import { makeStore } from "@/store/store";

import { addonsApi } from "./addons.api";
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

describe("addon RTK Query API", () => {
  it("loads unpaginated add-on options", async () => {
    const store = makeStore();
    const calls: InternalAxiosRequestConfig[] = [];
    store.dispatch(setRestaurantToken("restaurant-token"));
    restaurantClient.defaults.adapter = async (config) => {
      calls.push(config);
      return response(config, [
        {
          id: "addon-id",
          name: "Моцарелла",
          price: 12900,
          isAvailable: true,
        },
      ]);
    };

    try {
      const result = await store
        .dispatch(addonsApi.endpoints.getAddonOptions.initiate())
        .unwrap();

      assert.deepEqual(result, [
        {
          id: "addon-id",
          name: "Моцарелла",
          price: 12900,
          isAvailable: true,
        },
      ]);
      assert.equal(calls[0].url, "/admin/addons/options");
      assert.equal(calls[0].method, "get");
      assert.equal(
        calls[0].headers.get("Authorization"),
        "Bearer restaurant-token"
      );
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });
});
