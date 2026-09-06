import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { makeStore } from "../store";
import { setRestaurantToken } from "../slices/restaurant-auth.slice";
import { restaurantAuthApi, restaurantClient } from "./restaurant-auth.api";

const originalAdapter = restaurantClient.defaults.adapter;
afterEach(() => { restaurantClient.defaults.adapter = originalAdapter; });

const identity = (id: string) => ({
  id, name: id, role: "OWNER", restaurant: { id: `restaurant-${id}`, name: id },
});
const response = (config: InternalAxiosRequestConfig, data: unknown) => ({
  config, data, status: 200, statusText: "OK", headers: {},
});

describe("restaurant RTK Query session", () => {
  it("logs in without a Bearer header and loads the identity with the restaurant token", async () => {
    const store = makeStore();
    store.dispatch(setRestaurantToken("previous"));
    const calls: InternalAxiosRequestConfig[] = [];
    restaurantClient.defaults.adapter = async config => {
      calls.push(config);
      return response(config, config.url === "/admin/login" ? { accessToken: "restaurant-token" } : identity("a"));
    };
    try {
      const login = await store.dispatch(restaurantAuthApi.endpoints.loginRestaurant.initiate({
        login: "owner@example.com", password: "password",
      })).unwrap();
      store.dispatch(setRestaurantToken(login.accessToken));
      const user = await store.dispatch(restaurantAuthApi.endpoints.getRestaurantMe.initiate()).unwrap();
      assert.equal(calls[0].headers.get("Authorization"), undefined);
      assert.equal(calls[1].headers.get("Authorization"), "Bearer restaurant-token");
      assert.equal(user.restaurant.id, "restaurant-a");
      assert.equal(calls[0].withCredentials, false);
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });

  it("retries a failed session query and clears cached identity on logout", async () => {
    const store = makeStore();
    store.dispatch(setRestaurantToken("token"));
    let attempts = 0;
    restaurantClient.defaults.adapter = async config => {
      attempts += 1;
      if (attempts === 1) {
        throw new AxiosError("Unavailable", undefined, config, undefined, {
          ...response(config, { error: "Unavailable" }), status: 503,
        });
      }
      return response(config, identity("a"));
    };
    try {
      const failed = await store.dispatch(restaurantAuthApi.endpoints.getRestaurantMe.initiate());
      assert.equal(failed.isError, true);
      const user = await store.dispatch(restaurantAuthApi.endpoints.getRestaurantMe.initiate(undefined, {
        forceRefetch: true,
      })).unwrap();
      assert.equal(user.id, "a");
      store.dispatch(setRestaurantToken(null));
      store.dispatch(restaurantAuthApi.util.resetApiState());
      assert.equal(restaurantAuthApi.endpoints.getRestaurantMe.select()(store.getState()).data, undefined);
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });

  it("does not restore the previous identity when its request finishes after a session change", async () => {
    const store = makeStore();
    let completeOld: (() => void) | undefined;
    let started: (() => void) | undefined;
    const oldStarted = new Promise<void>(resolve => { started = resolve; });
    restaurantClient.defaults.adapter = (config => {
      if (config.headers.get("Authorization") === "Bearer old") {
        return new Promise(resolve => {
          completeOld = () => resolve(response(config, identity("old")));
          started?.();
        });
      }
      return Promise.resolve(response(config, identity("new")));
    }) satisfies AxiosAdapter;
    try {
      store.dispatch(setRestaurantToken("old"));
      const old = store.dispatch(restaurantAuthApi.endpoints.getRestaurantMe.initiate());
      await oldStarted;
      store.dispatch(restaurantAuthApi.util.resetApiState());
      store.dispatch(setRestaurantToken("new"));
      await store.dispatch(restaurantAuthApi.endpoints.getRestaurantMe.initiate()).unwrap();
      completeOld?.();
      await old;
      assert.equal(restaurantAuthApi.endpoints.getRestaurantMe.select()(store.getState()).data?.id, "new");
    } finally {
      store.dispatch(restaurantAuthApi.util.resetApiState());
    }
  });

  it("forwards RTK Query cancellation to Axios", async () => {
    const store = makeStore();
    let started: (() => void) | undefined;
    const requestStarted = new Promise<void>(resolve => { started = resolve; });
    let signal: InternalAxiosRequestConfig["signal"];
    restaurantClient.defaults.adapter = config => new Promise((_resolve, reject) => {
      signal = config.signal;
      signal?.addEventListener?.("abort", () => reject(new Error("aborted")));
      started?.();
    });
    const request = store.dispatch(restaurantAuthApi.endpoints.loginRestaurant.initiate({
      login: "owner@example.com", password: "password",
    }));
    await requestStarted;
    request.abort();
    await assert.rejects(request.unwrap(), { name: "AbortError" });
    assert.equal(signal?.aborted, true);
    store.dispatch(restaurantAuthApi.util.resetApiState());
  });
});
