import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET, POST } from "./route";

describe("super-admin restaurant-users collection route authorization", () => {
  it("rejects unauthenticated list and create requests", async () => {
    const requests = [
      GET(new Request("http://localhost/api/super-admin/users")),
      POST(
        new Request("http://localhost/api/super-admin/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({}),
        }),
      ),
    ];

    for (const response of await Promise.all(requests)) {
      assert.equal(response.status, 401);
    }
  });
});
