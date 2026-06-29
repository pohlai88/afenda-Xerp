import { AppErrors } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import {
  AFENDA_PROBLEM_TYPE_BASE,
  mapAppErrorCodeToHttpStatus,
  toProblemDetailFromAppError,
  toProblemDetailFromAppErrorWire,
} from "../app-error-to-problem-detail.js";

describe("app-error-to-problem-detail", () => {
  it("maps AppError codes to HTTP status at API boundary", () => {
    expect(mapAppErrorCodeToHttpStatus("UNAUTHORIZED")).toBe(401);
    expect(mapAppErrorCodeToHttpStatus("FORBIDDEN")).toBe(403);
    expect(mapAppErrorCodeToHttpStatus("NOT_FOUND")).toBe(404);
    expect(mapAppErrorCodeToHttpStatus("VALIDATION_ERROR")).toBe(422);
    expect(mapAppErrorCodeToHttpStatus("CONFLICT")).toBe(409);
    expect(mapAppErrorCodeToHttpStatus("INTERNAL_ERROR")).toBe(500);
  });

  it("projects AppError to kernel ProblemDetail wire shape", () => {
    const detail = toProblemDetailFromAppError(
      AppErrors.forbidden("You cannot edit this record."),
      { instance: "/api/internal/v1/inventory/products" }
    );

    expect(detail).toEqual({
      type: `${AFENDA_PROBLEM_TYPE_BASE}/forbidden`,
      title: "Forbidden",
      status: 403,
      detail: "You cannot edit this record.",
      instance: "/api/internal/v1/inventory/products",
    });
    expect(JSON.parse(JSON.stringify(detail))).toEqual(detail);
  });

  it("strips internal cause before ProblemDetail projection", () => {
    const detail = toProblemDetailFromAppError(
      AppErrors.internal(new Error("db connection lost"))
    );

    expect(detail.type).toBe(`${AFENDA_PROBLEM_TYPE_BASE}/internal-error`);
    expect(detail.detail).not.toContain("db");
    expect(JSON.parse(JSON.stringify(detail))).toEqual(detail);
  });

  it("maps validation field errors through wire-safe userMessage", () => {
    const detail = toProblemDetailFromAppErrorWire({
      code: "VALIDATION_ERROR",
      userMessage: "Please check the highlighted fields.",
      fields: [{ path: "email", message: "Invalid email" }],
    });

    expect(detail.status).toBe(422);
    expect(detail.type).toBe(`${AFENDA_PROBLEM_TYPE_BASE}/validation`);
  });
});
