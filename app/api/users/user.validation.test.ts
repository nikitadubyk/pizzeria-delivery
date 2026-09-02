import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  authorizationHeaderSchema,
  createRestaurantUserRequestSchema,
  restaurantUserListQuerySchema,
  restaurantUserPathParamsSchema,
  superAdminLoginRequestSchema,
  superAdminRefreshRequestSchema,
  updateRestaurantUserRequestSchema,
} from "./user.validation";

describe("user request validation", () => {
  it("normalizes a valid super-admin login request", async () => {
    const result = await superAdminLoginRequestSchema.validate({
      email: " ADMIN@EXAMPLE.COM ",
      password: "strong-password",
    });

    assert.equal(result.email, "admin@example.com");
  });

  it("rejects an invalid email", async () => {
    await assert.rejects(
      superAdminLoginRequestSchema.validate({
        email: "not-an-email",
        password: "strong-password",
      }),
    );
  });

  it("rejects a short password", async () => {
    await assert.rejects(
      superAdminLoginRequestSchema.validate({
        email: "admin@example.com",
        password: "short",
      }),
    );
  });

  it("requires a refresh token", async () => {
    await assert.rejects(
      superAdminRefreshRequestSchema.validate({ refreshToken: " " }),
    );
  });

  it("accepts a bearer authorization header", async () => {
    const result = await authorizationHeaderSchema.validate({
      authorization: "Bearer access-token",
    });

    assert.equal(result.authorization, "Bearer access-token");
  });

  it("rejects an invalid authorization header", async () => {
    await assert.rejects(
      authorizationHeaderSchema.validate({ authorization: "access-token" }),
    );
  });

  it("normalizes a valid restaurant user create request", async () => {
    const result = await createRestaurantUserRequestSchema.validate({
      restaurantId: " restaurant-id ",
      name: " Анна Иванова ",
      phone: " +79991234567 ",
      email: " USER@EXAMPLE.COM ",
      password: "strong-password",
      role: "OWNER",
    });

    assert.equal(result.restaurantId, "restaurant-id");
    assert.equal(result.name, "Анна Иванова");
    assert.equal(result.phone, "+79991234567");
    assert.equal(result.email, "user@example.com");
    assert.equal(result.role, "OWNER");
  });

  it("normalizes blank optional email values to null", async () => {
    for (const email of ["", "   ", null]) {
      const result = await createRestaurantUserRequestSchema.validate({
        restaurantId: "restaurant-id",
        name: "Анна Иванова",
        phone: "+79991234567",
        email,
        password: "strong-password",
        role: "OWNER",
      });

      assert.equal(result.email, null);
    }

    const update = await updateRestaurantUserRequestSchema.validate({
      email: "   ",
    });
    assert.equal(update.email, null);
  });

  it("rejects SUPER_ADMIN in restaurant user requests", async () => {
    await assert.rejects(
      createRestaurantUserRequestSchema.validate({
        restaurantId: "restaurant-id",
        name: "Admin",
        phone: "+79991234567",
        password: "strong-password",
        role: "SUPER_ADMIN",
      }),
    );
  });

  it("applies restaurant user list pagination defaults", async () => {
    assert.deepEqual(await restaurantUserListQuerySchema.validate({}), {
      page: 1,
      limit: 10,
    });
  });

  it("rejects an empty restaurant user update", async () => {
    await assert.rejects(updateRestaurantUserRequestSchema.validate({}));
  });

  it("requires a restaurant user id in route params", async () => {
    await assert.rejects(
      restaurantUserPathParamsSchema.validate({ userId: " " }),
    );
  });
});
