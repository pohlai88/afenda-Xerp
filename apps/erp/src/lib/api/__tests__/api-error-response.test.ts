import { AppErrors } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import {
  createApiErrorResponse,
  createProblemDetailResponse,
  PROBLEM_JSON_CONTENT_TYPE,
} from "../api-error-response.js";
import { AFENDA_PROBLEM_TYPE_BASE } from "../app-error-to-problem-detail.js";

describe("api-error-response", () => {
  it("returns application/problem+json for AppError", async () => {
    const response = createApiErrorResponse(AppErrors.unauthorized(), {
      instance: "/api/internal/v1/auth/memberships",
    });

    expect(response.status).toBe(401);
    expect(response.headers.get("Content-Type")).toBe(
      PROBLEM_JSON_CONTENT_TYPE
    );

    const body = await response.json();
    expect(body).toEqual({
      type: `${AFENDA_PROBLEM_TYPE_BASE}/unauthorized`,
      title: "Unauthorized",
      status: 401,
      detail: "Sign in to continue.",
      instance: "/api/internal/v1/auth/memberships",
    });
  });

  it("returns ProblemDetail response with explicit status fallback", async () => {
    const response = createProblemDetailResponse({
      type: `${AFENDA_PROBLEM_TYPE_BASE}/not-found`,
      title: "Resource not found",
      detail: "Tenant not found.",
    });

    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toBe(
      PROBLEM_JSON_CONTENT_TYPE
    );
    expect(await response.json()).toEqual({
      type: `${AFENDA_PROBLEM_TYPE_BASE}/not-found`,
      title: "Resource not found",
      detail: "Tenant not found.",
    });
  });
});
