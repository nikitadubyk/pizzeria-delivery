import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import bcrypt from "bcryptjs";
import { SignJWT, decodeJwt } from "jose";
import { RestaurantAuthService } from "./auth.service";
import type { RestaurantAuthRepository, RestaurantAuthUser } from "./auth.types";
import { restaurantLoginSchema, restaurantSessionSchema } from "./auth.validation";
import { RESTAURANT_PERMISSION as P, hasRestaurantPermission, type RestaurantPermission } from "@/lib/auth/restaurant-permissions";

process.env.ACCESS_TOKEN_SECRET = "restaurant-auth-test-secret-at-least-32-characters";
let password: string;
before(async () => { password = await bcrypt.hash("test-password", 4); });

function fixture() {
  const users: RestaurantAuthUser[] = ["pizza-a", "pizza-b"].map(id => ({
    id: `user-${id}`, restaurantId: id, email: `${id}@example.com`,
    phone: id === "pizza-a" ? "+79991234567" : "+79997654321",
    name: id, password, role: id === "pizza-a" ? "OWNER" : "EMPLOYEE",
    isActive: true, authVersion: 0, createdAt: new Date(), updatedAt: new Date(),
    restaurant: { id, name: id, slug: id, status: "ACTIVE", createdAt: new Date(), updatedAt: new Date() },
  }));
  const repository: RestaurantAuthRepository = {
    findCandidates: async login => users.filter(user => user.email === login || user.phone === login),
    findUser: async (tenant, id) => users.find(user => user.restaurantId === tenant && user.id === id) ?? null,
  };
  const service = new RestaurantAuthService(repository);
  const login = (index = 0) => service.login({ login: users[index].email!, password: "test-password" });
  return { users, service, login };
}

describe("Restaurant login service", () => {
  it("authorizes employee operations and denies owner-only operations", async () => {
    const { service, login } = fixture();
    const owner = await login(0);
    const employee = await login(1);
    for (const permission of Object.values(P)) {
      assert.equal((await service.authorize(owner, permission)).restaurant.id, "pizza-a");
    }
    for (const permission of [P.ADMIN_ACCESS, P.MENU_READ, P.STOP_LIST_MANAGE, P.ORDERS_READ, P.ORDERS_MANAGE]) {
      assert.equal((await service.authorize(employee, permission)).restaurant.id, "pizza-b");
    }
    for (const permission of [P.MENU_MANAGE, P.SETTINGS_MANAGE, P.EMPLOYEES_READ, P.EMPLOYEES_DISABLE, P.EMPLOYEES_RECOVER]) {
      await assert.rejects(service.authorize(employee, permission), { status: 403 });
    }
  });

  it("fails closed for unknown roles and permissions, including super admin", () => {
    for (const role of ["SUPER_ADMIN", "UNKNOWN", "toString", ""]) {
      assert.equal(hasRestaurantPermission(role, P.ADMIN_ACCESS), false);
    }
    assert.equal(hasRestaurantPermission("OWNER", "unknown" as RestaurantPermission), false);
  });

  it("rechecks database roles and account state before authorizing", async () => {
    const { users, service, login } = fixture();
    const token = await login();
    users[0].role = "EMPLOYEE";
    // Even without the database trigger, authorization uses the current role.
    await assert.rejects(service.authorize(token, P.MENU_MANAGE), { status: 403 });
    users[0].authVersion += 1;
    await assert.rejects(service.authorize(token, P.MENU_READ), { status: 401 });
    const fresh = await login();
    users[0].isActive = false;
    await assert.rejects(service.authorize(fresh, P.MENU_READ), { status: 401 });
  });

  it("does not accept client-supplied role or permission claims", async () => {
    const { service, login } = fixture();
    const claims = decodeJwt(await login(1));
    const token = await new SignJWT({ ...claims, role: "OWNER", permissions: Object.values(P) })
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    await assert.rejects(service.authorize(token, P.EMPLOYEES_DISABLE), { status: 403 });
    await assert.rejects(service.authorize("invalid", P.ADMIN_ACCESS), { status: 401 });
  });
  it("keeps the session after profile changes and rejects a new auth version", async () => {
    const { users, service, login } = fixture();
    const token = await login();
    users[0].name = "Updated name";
    users[0].updatedAt = new Date(users[0].updatedAt.getTime() + 1000);
    assert.equal((await service.authenticate(token)).name, "Updated name");
    users[0].authVersion += 1;
    await assert.rejects(service.authenticate(token), { status: 401 });
  });
  it("preserves server configuration errors instead of expiring the session", async () => {
    const { service, login } = fixture();
    const token = await login();
    const previous = process.env.ACCESS_TOKEN_SECRET;
    try {
      delete process.env.ACCESS_TOKEN_SECRET;
      await assert.rejects(service.authenticate(token), { status: 500 });
      process.env.ACCESS_TOKEN_SECRET = "short";
      await assert.rejects(service.authenticate(token), { status: 500 });
    } finally {
      process.env.ACCESS_TOKEN_SECRET = previous;
    }
  });
  it("finds owner and employee without slug and signs their database restaurant id", async () => {
    const { users, service, login } = fixture();
    for (const index of [0, 1]) {
      const token = await login(index);
      assert.equal(decodeJwt(token).restaurantId, users[index].restaurantId);
      const identity = await service.authenticate(token);
      assert.equal(identity.restaurant.id, users[index].restaurantId);
      assert.equal(identity.role, users[index].role);
      assert.equal("password" in identity, false);
    }
  });

  it("supports phone login", async () => {
    const { users, service } = fixture();
    const token = await service.login({ login: users[1].phone!, password: "test-password" });
    assert.equal((await service.authenticate(token)).id, users[1].id);
  });

  it("ignores tenant identifiers supplied with the login request", async () => {
    const input = await restaurantLoginSchema.validate({
      login: " pizza-a@example.com ", password: "test-password", restaurantId: "pizza-b", slug: "pizza-b",
    }, { stripUnknown: true });
    assert.deepEqual(input, { login: "pizza-a@example.com", password: "test-password" });
  });

  it("rejects wrong passwords, missing accounts and ambiguous logins", async () => {
    const { users, service, login } = fixture();
    await assert.rejects(service.login({ login: users[0].email!, password: "wrong" }), { status: 401 });
    await assert.rejects(service.login({ login: "missing", password: "wrong" }), { status: 401 });
    users[1].email = users[0].email;
    await assert.rejects(login(), { status: 401 });
  });

  it("rejects blocked users and restaurants, changed passwords and reassigned tenants", async () => {
    const mutations = [
      (user: RestaurantAuthUser) => { user.isActive = false; },
      (user: RestaurantAuthUser) => { user.restaurant!.status = "SUSPENDED"; },
      (user: RestaurantAuthUser) => { user.restaurant!.status = "ARCHIVED"; },
      (user: RestaurantAuthUser) => {
        user.password = "changed";
        user.authVersion += 1;
      },
      (user: RestaurantAuthUser) => { user.restaurantId = "pizza-b"; },
      (user: RestaurantAuthUser) => { user.role = "SUPER_ADMIN"; },
    ];
    for (const mutate of mutations) {
      const { users, service, login } = fixture();
      const token = await login();
      mutate(users[0]);
      await assert.rejects(service.authenticate(token), { status: 401 });
    }
  });

  it("rejects tampered, expired and super-admin tokens", async () => {
    const { service, login } = fixture();
    const parts = (await login()).split(".");
    parts[1] = Buffer.from(JSON.stringify({ ...decodeJwt(parts.join(".")), restaurantId: "pizza-b" })).toString("base64url");
    await assert.rejects(service.authenticate(parts.join(".")), { status: 401 });

    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const superAdmin = await new SignJWT({ type: "access", role: "SUPER_ADMIN" })
      .setProtectedHeader({ alg: "HS256" }).setSubject("global").setExpirationTime("1h").sign(secret);
    await assert.rejects(service.authenticate(superAdmin), { status: 401 });
    const expired = await new SignJWT({ type: "restaurant-session", restaurantId: "pizza-a" })
      .setProtectedHeader({ alg: "HS256" }).setSubject("user-pizza-a")
      .setIssuer("pizzeria-delivery").setAudience("restaurant-admin").setExpirationTime(1).sign(secret);
    await assert.rejects(service.authenticate(expired), { status: 401 });
  });

  it("validates login input and rejects malformed session claims without coercion", async () => {
    for (const login of ["", "invalid", "12345"]) {
      await assert.rejects(restaurantLoginSchema.validate({ login, password: "password" }));
    }
    const claims = { sub: "user", restaurantId: "restaurant", type: "restaurant-session", version: 0 };
    for (const invalid of [
      { ...claims, sub: undefined },
      { ...claims, restaurantId: 123 },
      { ...claims, restaurantId: " " },
      { ...claims, type: "access" },
      { ...claims, version: undefined },
      { ...claims, version: "0" },
      { ...claims, version: -1 },
    ]) {
      await assert.rejects(restaurantSessionSchema.validate(invalid));
    }
  });
});
