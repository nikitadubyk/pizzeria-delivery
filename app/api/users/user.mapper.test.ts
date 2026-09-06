import assert from "node:assert/strict";
import { describe, it } from "node:test";

import dayjs from "dayjs";

import { toRestaurantUserDto } from "./user.mapper";
import type { RestaurantUser } from "./types";

describe("restaurant user mapper", () => {
  it("never exposes the password in a restaurant-user DTO", () => {
    const user: RestaurantUser = {
      id: "user-id",
      restaurantId: "restaurant-id",
      restaurant: { id: "restaurant-id", name: "Pizza Place" },
      phone: "+79991234567",
      email: "user@example.com",
      name: "Анна Иванова",
      password: "secret-hash",
      role: "OWNER",
      isActive: true,
      authVersion: 0,
      createdAt: dayjs("2026-01-01T00:00:00Z").toDate(),
      updatedAt: dayjs("2026-01-02T00:00:00Z").toDate(),
    };

    const dto = toRestaurantUserDto(user);

    assert.equal("password" in dto, false);
    assert.equal(JSON.stringify(dto).includes("secret-hash"), false);
  });
});
