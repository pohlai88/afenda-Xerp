import { describe, expect, it } from "vitest";
import type { ProblemDetail } from "../contracts/problem-detail.contract.js";

describe("problem detail contract", () => {
  it("accepts RFC 9457 wire shape as JSON-serializable", () => {
    const detail: ProblemDetail = {
      type: "https://afenda.dev/problems/validation",
      title: "Validation failed",
      detail: "tenantId is required",
      instance: "/api/internal/v1/context",
    };

    expect(JSON.parse(JSON.stringify(detail))).toEqual(detail);
  });
});
