import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { User } from "@/app/generated/prisma/client";
import dayjs from "dayjs";

import { UserService, UserServiceError } from "./user.service";
import type { TokenService, UserRepository } from "./types";

const createSuperAdmin = (overrides: Partial<User> = {}): User => ({
  id: "super-admin-id",
  restaurantId: null,
  phone: null,
  email: "admin@example.com",
  name: "Super Admin",
  password: "",
  role: "SUPER_ADMIN",
  isActive: true,
  createdAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  updatedAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  ...overrides,
});

const tokenService: TokenService = {
  createAccessToken: async () => "access-token",
  createRefreshToken: async () => "refresh-token",
  verifyAccessToken: async () => "super-admin-id",
  verifyRefreshToken: async () => "super-admin-id",
};

const emptyRepository: UserRepository = {
  findSuperAdminByEmail: async () => null,
  findSuperAdminById: async () => null,
};

describe("UserService", () => {
  it("hashes and verifies a password", async () => {
    const service = new UserService(emptyRepository, tokenService);
    const hash = await service.hashPassword("strong-password");

    assert.notEqual(hash, "strong-password");
    assert.equal(await service.verifyPassword("strong-password", hash), true);
    assert.equal(await service.verifyPassword("wrong-password", hash), false);
  });

  it("logs in a super admin and returns a token pair", async () => {
    const passwordService = new UserService(emptyRepository, tokenService);
    const password = await passwordService.hashPassword("strong-password");
    const repository: UserRepository = {
      findSuperAdminByEmail: async (email) => {
        assert.equal(email, "admin@example.com");
        return createSuperAdmin({ password });
      },
      findSuperAdminById: async () => null,
    };
    const service = new UserService(repository, tokenService);

    const result = await service.login({
      email: "admin@example.com",
      password: "strong-password",
    });

    assert.equal(result.accessToken, "access-token");
    assert.equal(result.refreshToken, "refresh-token");
    assert.equal(result.user.role, "SUPER_ADMIN");
    assert.equal("password" in result.user, false);
  });

  it("returns a Russian error for an invalid password", async () => {
    const passwordService = new UserService(emptyRepository, tokenService);
    const password = await passwordService.hashPassword("strong-password");
    const service = new UserService(
      {
        findSuperAdminByEmail: async () => createSuperAdmin({ password }),
        findSuperAdminById: async () => null,
      },
      tokenService,
    );

    await assert.rejects(
      service.login({
        email: "admin@example.com",
        password: "wrong-password",
      }),
      (error: unknown) =>
        error instanceof UserServiceError &&
        error.message === "Неверный email или пароль",
    );
  });

  it("refreshes the token pair for an active super admin", async () => {
    const service = new UserService(
      {
        findSuperAdminByEmail: async () => null,
        findSuperAdminById: async (id) => {
          assert.equal(id, "super-admin-id");
          return createSuperAdmin();
        },
      },
      tokenService,
    );

    const result = await service.refresh({ refreshToken: "valid-token" });

    assert.deepEqual(result, {
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("returns the current active super admin", async () => {
    const service = new UserService(
      {
        findSuperAdminByEmail: async () => null,
        findSuperAdminById: async () => createSuperAdmin(),
      },
      tokenService,
    );

    const user = await service.getCurrentSuperAdmin("access-token");

    assert.equal(user.id, "super-admin-id");
    assert.equal(user.role, "SUPER_ADMIN");
    assert.equal("password" in user, false);
  });
});
