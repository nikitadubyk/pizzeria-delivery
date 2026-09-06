import assert from "node:assert/strict";
import { it } from "node:test";
import { POST } from "./route";
import { GET } from "../me/route";

it("rejects invalid login input and missing/malformed Bearer headers", async () => {
  const invalid = await POST(new Request("http://localhost/api/admin/login", {
    method: "POST", body: JSON.stringify({ login: "invalid", password: "" }),
  }));
  assert.equal(invalid.status, 400);
  for (const authorization of ["", "Basic value", "Bearer "]) {
    const response = await GET(new Request("http://localhost/api/admin/me", {
      headers: { authorization, cookie: "pizzeria_restaurant_session=old-token" },
    }));
    assert.equal(response.status, 401);
  }
});
