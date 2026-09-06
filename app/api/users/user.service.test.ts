import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Prisma, type User } from "@/app/generated/prisma/client";
import { HttpStatus } from "@/app/api/common/api-response";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

import { UserService, UserServiceError } from "./user.service";
import type { RestaurantUser, TokenService, UserRepository } from "./types";

const createSuperAdmin = (overrides: Partial<User> = {}): User => ({
  id: "super-admin-id",
  restaurantId: null,
  phone: null,
  email: "admin@example.com",
  name: "Super Admin",
  password: "",
  role: "SUPER_ADMIN",
  isActive: true,
  authVersion: 0,
  createdAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  updatedAt: dayjs("2026-01-01T00:00:00Z").toDate(),
  ...overrides,
});

const createRestaurantUser = (
  overrides: Partial<RestaurantUser> = {},
): RestaurantUser => ({
  ...createSuperAdmin({
    id: "user-id",
    restaurantId: "restaurant-id",
    phone: "+79991234567",
    email: "user@example.com",
    role: "EMPLOYEE",
  }),
  restaurant: { id: "restaurant-id", name: "Pizza Place" },
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
  findRestaurantUserPage: async () => ({ items: [], total: 0 }),
  findRestaurantUserById: async () => null,
  restaurantExists: async () => false,
  createRestaurantUser: async () => {
    throw new Error("Not implemented in this test");
  },
  updateRestaurantUser: async () => {
    throw new Error("Not implemented in this test");
  },
  deleteRestaurantUser: async () => {
    throw new Error("Not implemented in this test");
  },
};

const prismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError("Repository error", {
    code,
    clientVersion: "test",
  });

const userInput = {
  restaurantId: "restaurant-id",
  name: "Анна Иванова",
  phone: "+79991234567",
  email: "user@example.com",
  password: "strong-password",
  role: "OWNER" as const,
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
      ...emptyRepository,
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
        ...emptyRepository,
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
        ...emptyRepository,
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
        ...emptyRepository,
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

  it("returns a page of restaurant users", async () => {
    const items = [createRestaurantUser()];
    const service = new UserService(
      {
        ...emptyRepository,
        findRestaurantUserPage: async (superAdminId, pagination) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.deepEqual(pagination, { page: 2, limit: 10 });
          return { items, total: 11 };
        },
      },
      tokenService,
    );

    assert.deepEqual(
      await service.getRestaurantUserPage("super-admin-id", {
        page: 2,
        limit: 10,
      }),
      { items, total: 11 },
    );
  });

  it("creates a restaurant user with a hashed password", async () => {
    const service = new UserService(
      {
        ...emptyRepository,
        restaurantExists: async (_superAdminId, restaurantId) =>
          restaurantId === "restaurant-id",
        createRestaurantUser: async (superAdminId, data) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.notEqual(data.password, "strong-password");
          assert.equal(
            await bcrypt.compare("strong-password", data.password),
            true,
          );
          return createRestaurantUser(data);
        },
      },
      tokenService,
    );

    const user = await service.createRestaurantUser("super-admin-id", {
      restaurantId: "restaurant-id",
      name: "Анна Иванова",
      phone: "+79991234567",
      email: "user@example.com",
      password: "strong-password",
      role: "OWNER",
    });

    assert.equal(user.role, "OWNER");
  });

  it("rejects a restaurant user for a missing restaurant", async () => {
    const service = new UserService(emptyRepository, tokenService);

    await assert.rejects(
      service.createRestaurantUser("super-admin-id", {
        restaurantId: "missing-id",
        name: "Анна Иванова",
        phone: "+79991234567",
        password: "strong-password",
        role: "EMPLOYEE",
      }),
      (error: unknown) =>
        error instanceof UserServiceError &&
        error.status === HttpStatus.NOT_FOUND,
    );
  });

  it("updates a restaurant user and hashes a new password", async () => {
    const service = new UserService(
      {
        ...emptyRepository,
        findRestaurantUserById: async () => createRestaurantUser(),
        updateRestaurantUser: async (superAdminId, userId, data) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.equal(userId, "user-id");
          assert.ok(data.password);
          assert.notEqual(data.password, "new-strong-password");
          assert.equal(
            await bcrypt.compare("new-strong-password", data.password),
            true,
          );
          return createRestaurantUser({ name: data.name ?? "Updated" });
        },
      },
      tokenService,
    );

    const user = await service.updateRestaurantUser(
      "super-admin-id",
      "user-id",
      { name: "Новое имя", password: "new-strong-password" },
    );

    assert.equal(user.name, "Новое имя");
  });

  it("deletes a restaurant user", async () => {
    let deleted = false;
    const service = new UserService(
      {
        ...emptyRepository,
        findRestaurantUserById: async () => createRestaurantUser(),
        deleteRestaurantUser: async (superAdminId, userId) => {
          assert.equal(superAdminId, "super-admin-id");
          assert.equal(userId, "user-id");
          deleted = true;
          return createRestaurantUser();
        },
      },
      tokenService,
    );

    await service.deleteRestaurantUser("super-admin-id", "user-id");
    assert.equal(deleted, true);
  });

  it("does not update or delete a SUPER_ADMIN account", async () => {
    let wroteUser = false;
    const service = new UserService(
      {
        ...emptyRepository,
        // The repository scope deliberately excludes SUPER_ADMIN rows.
        findRestaurantUserById: async () => null,
        updateRestaurantUser: async () => {
          wroteUser = true;
          return createRestaurantUser();
        },
        deleteRestaurantUser: async () => {
          wroteUser = true;
          return createRestaurantUser();
        },
      },
      tokenService,
    );

    for (const operation of [
      () =>
        service.updateRestaurantUser("super-admin-id", "super-admin-id", {
          name: "Changed",
        }),
      () => service.deleteRestaurantUser("super-admin-id", "super-admin-id"),
    ]) {
      await assert.rejects(
        operation(),
        (error: unknown) =>
          error instanceof UserServiceError &&
          error.status === HttpStatus.NOT_FOUND,
      );
    }

    assert.equal(wroteUser, false);
  });

  it("maps P2002 to a conflict", async () => {
    const service = new UserService(
      {
        ...emptyRepository,
        restaurantExists: async () => true,
        createRestaurantUser: async () => {
          throw prismaError("P2002");
        },
      },
      tokenService,
    );

    await assert.rejects(
      service.createRestaurantUser("super-admin-id", userInput),
      (error: unknown) =>
        error instanceof UserServiceError &&
        error.status === HttpStatus.CONFLICT,
    );
  });

  it("maps P2003 to a missing restaurant", async () => {
    const service = new UserService(
      {
        ...emptyRepository,
        restaurantExists: async () => true,
        createRestaurantUser: async () => {
          throw prismaError("P2003");
        },
      },
      tokenService,
    );

    await assert.rejects(
      service.createRestaurantUser("super-admin-id", userInput),
      (error: unknown) =>
        error instanceof UserServiceError &&
        error.status === HttpStatus.NOT_FOUND,
    );
  });

  it("maps P2025 from update and delete to a missing user", async () => {
    const service = new UserService(
      {
        ...emptyRepository,
        findRestaurantUserById: async () => createRestaurantUser(),
        updateRestaurantUser: async () => {
          throw prismaError("P2025");
        },
        deleteRestaurantUser: async () => {
          throw prismaError("P2025");
        },
      },
      tokenService,
    );

    for (const operation of [
      () =>
        service.updateRestaurantUser("super-admin-id", "user-id", {
          name: "Changed",
        }),
      () => service.deleteRestaurantUser("super-admin-id", "user-id"),
    ]) {
      await assert.rejects(
        operation(),
        (error: unknown) =>
          error instanceof UserServiceError &&
          error.status === HttpStatus.NOT_FOUND,
      );
    }
  });
});
