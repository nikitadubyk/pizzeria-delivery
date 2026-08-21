import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../auth/auth-storage";
import { advanceAuthSessionRevision, apiClient } from "./axios";

const values = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return values.size;
  },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => {
    values.delete(key);
  },
  setItem: (key, value) => {
    values.set(key, value);
  },
};

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalLocalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  "localStorage",
);

describe("auth request session isolation", () => {
  before(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {},
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: localStorageMock,
    });
  });

  after(() => {
    clearAuthSession();

    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }

    if (originalLocalStorage) {
      Object.defineProperty(globalThis, "localStorage", originalLocalStorage);
    } else {
      Reflect.deleteProperty(globalThis, "localStorage");
    }
  });

  it("does not clear a new login session when an old request returns 401", async () => {
    saveTokens({ accessToken: "old-access", refreshToken: "old-refresh" });

    let rejectOldRequest: (() => void) | undefined;
    const oldRequest = apiClient.get("/super-admin/me", {
      adapter: (config) =>
        new Promise((_resolve, reject) => {
          rejectOldRequest = () =>
            reject(
              new AxiosError(
                "Unauthorized",
                AxiosError.ERR_BAD_REQUEST,
                config as InternalAxiosRequestConfig,
                undefined,
                {
                  config: config as InternalAxiosRequestConfig,
                  data: { error: "Unauthorized" },
                  headers: {},
                  status: 401,
                  statusText: "Unauthorized",
                },
              ),
            );
        }),
    });

    await new Promise((resolve) => setImmediate(resolve));
    assert.ok(rejectOldRequest);

    advanceAuthSessionRevision();
    saveTokens({ accessToken: "new-access", refreshToken: "new-refresh" });
    rejectOldRequest();

    await assert.rejects(oldRequest, axios.isAxiosError);
    assert.equal(getAccessToken(), "new-access");
    assert.equal(getRefreshToken(), "new-refresh");
  });
});
