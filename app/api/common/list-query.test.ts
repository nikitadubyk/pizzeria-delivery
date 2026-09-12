import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createPaginationMeta,
  createSearchPaginationSchema,
} from "./list-query";

describe("list query helpers", () => {
  const schema = createSearchPaginationSchema({
    defaultLimit: 20,
    maxLimit: 100,
  });

  it("applies pagination defaults and normalizes search", async () => {
    assert.deepEqual(await schema.validate({ search: "  пицца  " }), {
      page: 1,
      limit: 20,
      search: "пицца",
    });
    assert.deepEqual(await schema.validate({ search: "  " }), {
      page: 1,
      limit: 20,
    });
  });

  it("rejects invalid pagination", async () => {
    await assert.rejects(schema.validate({ page: 0, limit: 101 }));
  });

  it("creates pagination response metadata", () => {
    assert.deepEqual(
      createPaginationMeta({ page: 2, limit: 20, total: 41 }),
      { page: 2, limit: 20, total: 41, totalPages: 3 },
    );
  });
});
