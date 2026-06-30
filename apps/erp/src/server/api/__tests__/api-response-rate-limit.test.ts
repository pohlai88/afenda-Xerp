import { describe, expect, it } from "vitest";

import {
  jsonErrorResponse,
  jsonSuccessResponse,
  RATE_LIMIT_LIMIT_HEADER,
  RATE_LIMIT_REMAINING_HEADER,
  RATE_LIMIT_RESET_HEADER,
  RETRY_AFTER_HEADER,
} from "@/server/api/runtime/api-response";

describe("api response rate-limit headers", () => {
  const meta = {
    correlationId: "corr-test",
    requestId: "req-test",
    timestamp: "2026-06-30T00:00:00.000Z",
  };

  const snapshot = {
    allowed: true,
    limit: 120,
    policy: "authenticated-standard" as const,
    remaining: 119,
    resetAtUnix: 1_751_000_000,
    retryAfterSeconds: null,
  };

  it("adds rate-limit headers on success responses", () => {
    const response = jsonSuccessResponse(
      { ok: true },
      meta,
      { kind: "no-store" },
      200,
      snapshot
    );

    expect(response.headers.get(RATE_LIMIT_LIMIT_HEADER)).toBe("120");
    expect(response.headers.get(RATE_LIMIT_REMAINING_HEADER)).toBe("119");
    expect(response.headers.get(RATE_LIMIT_RESET_HEADER)).toBe("1751000000");
  });

  it("adds retry-after and rate-limit headers on 429 responses", () => {
    const deniedSnapshot = {
      ...snapshot,
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 42,
    };

    const response = jsonErrorResponse(
      "rate_limited",
      "Too many requests.",
      meta,
      { retryAfterSeconds: 42 },
      deniedSnapshot
    );

    expect(response.status).toBe(429);
    expect(response.headers.get(RETRY_AFTER_HEADER)).toBe("42");
    expect(response.headers.get(RATE_LIMIT_REMAINING_HEADER)).toBe("0");
  });
});
