import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ApiError, ApiResponse, HttpStatus } from "./api-response";

describe("ApiResponse", () => {
  it("returns a successful JSON response", async () => {
    const response = ApiResponse.success({ result: "ok" });

    assert.equal(response.status, HttpStatus.OK);
    assert.deepEqual(await response.json(), { result: "ok" });
  });

  it("uses the status and message from ApiError", async () => {
    const response = ApiResponse.fromError(
      new ApiError("Доступ запрещён", HttpStatus.FORBIDDEN),
      "Неизвестная ошибка",
    );

    assert.equal(response.status, HttpStatus.FORBIDDEN);
    assert.deepEqual(await response.json(), { error: "Доступ запрещён" });
  });

  it("returns a bad request for invalid JSON", async () => {
    const response = ApiResponse.fromError(
      new SyntaxError("Invalid JSON"),
      "Неизвестная ошибка",
    );

    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.deepEqual(await response.json(), {
      error: "Некорректное тело запроса",
    });
  });
});
