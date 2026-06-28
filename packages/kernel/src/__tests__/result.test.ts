import { describe, expect, it } from "vitest";

import type { AppError } from "../contracts/app-error.contract.js";
import { AppErrors } from "../contracts/app-error.contract.js";
import {
  err,
  errWire,
  isErr,
  isOk,
  ok,
  okWire,
  type Result,
  type WireResult,
} from "../contracts/result.contract.js";

describe("result contract", () => {
  it("creates success and failure results", () => {
    const success = ok({ id: "tenant-1" });
    const failure = err(new Error("failed"));

    expect(isOk(success)).toBe(true);
    expect(success.value).toEqual({ id: "tenant-1" });
    expect(isErr(failure)).toBe(true);
    expect(failure.error.message).toBe("failed");
  });

  it("narrows to ResultSuccess via isOk", () => {
    const result: Result<string, Error> = ok("hello");

    if (isOk(result)) {
      // TypeScript narrows result to ResultSuccess<string> here
      expect(result.value).toBe("hello");
    } else {
      throw new Error("Expected success");
    }
  });

  it("narrows to ResultFailure via isErr", () => {
    const result: Result<string, Error> = err(new Error("oops"));

    if (isErr(result)) {
      // TypeScript narrows result to ResultFailure<Error> here
      expect(result.error.message).toBe("oops");
    } else {
      throw new Error("Expected failure");
    }
  });

  it("works with AppError as the error type", () => {
    function findUser(id: string): Result<{ id: string }, AppError> {
      if (id === "missing") {
        return err(AppErrors.notFound("User"));
      }
      return ok({ id });
    }

    const success = findUser("usr_01ABCDEFGHJKMNPQRSTVWXYZ0");
    const failure = findUser("missing");

    expect(isOk(success)).toBe(true);
    if (isOk(success)) {
      expect(success.value.id).toBe("usr_01ABCDEFGHJKMNPQRSTVWXYZ0");
    }

    expect(isErr(failure)).toBe(true);
    if (isErr(failure)) {
      expect(failure.error.code).toBe("NOT_FOUND");
    }
  });

  it("creates wire-safe okWire and errWire results", () => {
    const success: WireResult<{ id: string }> = okWire({ id: "tenant-1" });
    const failure = errWire("validation failed");

    expect(isOk(success)).toBe(true);
    expect(success.value).toEqual({ id: "tenant-1" });
    expect(isErr(failure)).toBe(true);
    expect(failure.error).toBe("validation failed");
  });
});
