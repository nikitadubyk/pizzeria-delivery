import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DELETE, GET, PATCH } from "./route";

const context = { params: Promise.resolve({ userId: "user-id" }) };

describe("super-admin restaurant-user item route authorization", () => {
  it("rejects unauthenticated read, update, and delete requests", async () => {
    const responses = await Promise.all([
      GET(
        new Request("http://localhost/api/super-admin/users/user-id"),
        context,
      ),
      PATCH(
        new Request("http://localhost/api/super-admin/users/user-id", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: "Changed" }),
        }),
        context,
      ),
      DELETE(
        new Request("http://localhost/api/super-admin/users/user-id", {
          method: "DELETE",
        }),
        context,
      ),
    ]);

    for (const response of responses) assert.equal(response.status, 401);
  });
});
