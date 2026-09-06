import assert from "node:assert/strict";
import { it } from "node:test";
import { clearRestaurantToken, getRestaurantToken, saveRestaurantToken } from "./restaurant-auth-storage";

it("persists restaurant login and logs out without clearing super admin", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map<string, string>([["accessToken", "super-admin-token"]]);
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } });
  try {
    assert.equal(getRestaurantToken(), null);
    saveRestaurantToken("restaurant-token");
    assert.equal(getRestaurantToken(), "restaurant-token");
    clearRestaurantToken();
    assert.equal(getRestaurantToken(), null);
    assert.equal(values.get("accessToken"), "super-admin-token");
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
