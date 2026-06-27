import { describe, expect, it } from "vitest";
import type { ProblemDetail } from "../contracts/problem-detail.contract.js";

describe("problem detail contract", () => {
  it("accepts full RFC 9457 wire shape as JSON-serializable", () => {
    const detail: ProblemDetail = {
      type: "https://afenda.dev/problems/validation",
      title: "Validation failed",
      status: 422,
      detail: "tenantId is required",
      instance: "/api/internal/v1/context",
    };

    expect(JSON.parse(JSON.stringify(detail))).toEqual(detail);
  });

  it("accepts minimal required fields only", () => {
    const detail: ProblemDetail = {
      type: "https://afenda.dev/problems/not-found",
      title: "Resource not found",
    };

    expect(JSON.parse(JSON.stringify(detail))).toEqual(detail);
    expect(detail.status).toBeUndefined();
    expect(detail.detail).toBeUndefined();
    expect(detail.instance).toBeUndefined();
  });

  it("accepts status field aligned to HTTP status codes", () => {
    const detail: ProblemDetail = {
      type: "https://afenda.dev/problems/unauthorized",
      title: "Unauthorized",
      status: 401,
    };

    expect(detail.status).toBe(401);
    expect(JSON.parse(JSON.stringify(detail))).toEqual(detail);
  });
});
