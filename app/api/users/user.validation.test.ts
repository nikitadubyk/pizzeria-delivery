import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  authorizationHeaderSchema,
  superAdminLoginRequestSchema,
  superAdminRefreshRequestSchema,
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
});
