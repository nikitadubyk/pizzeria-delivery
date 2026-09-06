import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import { systemDb } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/crypto";


async function main(): Promise<void> {
  const base = "http://localhost:3100";
  const suffix = randomUUID();
  const ids: string[] = [];
  const password = `test-${suffix}`;
  const passwordHash = await hashPassword(password);
  const phoneBase = randomInt(1000000000, 9000000000);
  const request = (path: string, token?: string) => fetch(`${base}${path}`, {
    redirect: "manual", headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  try {
    for (const point of ["a", "b"]) {
      const restaurant = await systemDb.restaurant.create({ data: {
        name: `Integration ${point} ${suffix}`, slug: `test-${point}-${suffix}`,
      } });
      ids.push(restaurant.id);
      await systemDb.user.create({ data: {
        restaurantId: restaurant.id, role: "OWNER", name: `Owner ${point}`,
        phone: `+7${phoneBase + ids.length}`, email: `${point}-${suffix}@example.com`, password: passwordHash,
      } });
    }
    const employee = await systemDb.user.create({ data: {
      restaurantId: ids[0], role: "EMPLOYEE", name: "Employee A", email: `employee-${suffix}@example.com`, phone: `+7${phoneBase + 3}`, password: passwordHash,
    } });
    const login = async (point: string, login = `${point}-${suffix}@example.com`) => {
      const response = await fetch(`${base}/api/admin/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, restaurantId: ids[1] }),
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("set-cookie"), null);
      return (await response.json()).accessToken as string;
    };
    const ownerToken = await login("a");
    const otherToken = await login("b");
    const employeeToken = await login("a", employee.email!);
    for (const duplicate of [
      { email: employee.email!.toUpperCase(), phone: `+7${phoneBase + 4}` },
      { email: `duplicate-${suffix}@example.com`, phone: employee.phone },
    ]) {
      await assert.rejects(systemDb.user.create({ data: {
        restaurantId: ids[1], role: "EMPLOYEE", password: passwordHash, ...duplicate,
      } }), { code: "P2002" });
    }
    await systemDb.user.update({ where: { id: employee.id }, data: { name: "Updated employee" } });
    assert.equal((await request("/api/admin/me", employeeToken)).status, 200);

    assert.equal((await request("/api/admin/me")).status, 401);
    const oldCookie = await fetch(`${base}/api/admin/me`, { headers: { cookie: `pizzeria_restaurant_session=${ownerToken}` } });
    assert.equal(oldCookie.status, 401);
    const invalid = await fetch(`${base}/api/admin/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: "invalid", password }),
    });
    assert.equal(invalid.status, 400);
    const loginPage = await request("/admin/login");
    assert.equal(loginPage.status, 200);
    assert(!(await loginPage.text()).includes('name="slug"'));
    for (const [token, id] of [[ownerToken, ids[0]], [otherToken, ids[1]]]) {
      const me = await request("/api/admin/me", token);
      assert.equal(me.status, 200);
      assert.equal((await me.json()).restaurant.id, id);
      const injected = await request(`/api/admin/me?restaurantId=${ids[1]}`, token);
      assert.equal((await injected.json()).restaurant.id, id);
      assert.equal((await request("/admin", token)).status, 200);
    }
    assert.equal((await request("/admin", employeeToken)).status, 200);
    assert.equal((await request("/api/super-admin/me", employeeToken)).status, 401);
    await systemDb.user.update({ where: { id: employee.id }, data: { isActive: false } });
    assert.equal((await request("/api/admin/me", employeeToken)).status, 401);
    await systemDb.user.update({ where: { id: employee.id }, data: { isActive: true } });
    assert.equal((await request("/api/admin/me", employeeToken)).status, 401);
    const freshToken = await login("a", employee.email!);
    await systemDb.user.update({ where: { id: employee.id }, data: { password: await hashPassword(`${password}-new`) } });
    assert.equal((await request("/api/admin/me", freshToken)).status, 401);
    await systemDb.restaurant.update({ where: { id: ids[0] }, data: { status: "SUSPENDED" } });
    assert.equal((await request("/api/admin/me", ownerToken)).status, 401);
    assert.equal((await request("/api/admin/me", otherToken)).status, 200);
    console.log("PASS: production pages/API, two PostgreSQL tenants, query tampering, role checks and active-session blocking");
  } finally {
    try {
      for (const id of ids) await systemDb.restaurant.deleteMany({ where: { id, slug: { endsWith: suffix } } });
    } finally {
      await systemDb.$disconnect();
    }
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
