import { describe, expect, it } from "vitest";
import { err, isErr, isOk, ok } from "../contracts/result.contract.js";

describe("result contract", () => {
  it("creates success and failure results", () => {
    const success = ok({ id: "tenant-1" });
    const failure = err(new Error("failed"));

    expect(isOk(success)).toBe(true);
    expect(success.value).toEqual({ id: "tenant-1" });
    expect(isErr(failure)).toBe(true);
    expect(failure.error.message).toBe("failed");
  });
});
