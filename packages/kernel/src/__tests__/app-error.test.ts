import { describe, expect, it } from "vitest";

import {
  type AppErrorCode,
  AppErrors,
  toAppErrorWire,
} from "../contracts/app-error.contract.js";

describe("AppError contract", () => {
  it("creates validation errors with optional fields", () => {
    const error = AppErrors.validation([
      { path: "email", message: "Invalid email" },
    ]);

    expect(error.code).toBe("VALIDATION_ERROR");
    if (error.code === "VALIDATION_ERROR") {
      expect(error.fields).toHaveLength(1);
    }
  });

  it("creates domain errors with stable codes", () => {
    const codes: AppErrorCode[] = [
      AppErrors.unauthorized().code,
      AppErrors.forbidden().code,
      AppErrors.notFound("User").code,
      AppErrors.conflict("email").code,
      AppErrors.internal().code,
    ];

    expect(codes).toEqual([
      "UNAUTHORIZED",
      "FORBIDDEN",
      "NOT_FOUND",
      "CONFLICT",
      "INTERNAL_ERROR",
    ]);
  });

  it("does not expose internal cause in userMessage", () => {
    const error = AppErrors.internal(new Error("db connection lost"));
    expect(error.userMessage).not.toContain("db");
    expect(error.userMessage).not.toContain("connection");
  });

  it("strips non-serializable cause for wire egress and round-trips", () => {
    const error = AppErrors.internal(new Error("db connection lost"));
    const wire = toAppErrorWire(error);

    expect("cause" in wire).toBe(false);
    expect(JSON.parse(JSON.stringify(wire))).toEqual({
      code: "INTERNAL_ERROR",
      userMessage: "Something went wrong. Please try again.",
    });
  });
});
