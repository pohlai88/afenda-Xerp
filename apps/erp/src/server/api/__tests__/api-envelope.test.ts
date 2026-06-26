import { describe, expect, it } from "vitest";

import {
  API_ERROR_CODES,
  API_ERROR_DEFINITIONS,
} from "@/server/api/contracts/api-error.contract";
import {
  createErrorEnvelope,
  createSuccessEnvelope,
} from "@/server/api/runtime/api-response";

describe("API envelope", () => {
  const meta = {
    correlationId: "corr-test",
    requestId: "req-test",
    timestamp: "2026-01-01T00:00:00.000Z",
  };

  it("creates success envelopes with data and meta only", () => {
    const envelope = createSuccessEnvelope({ status: "ok" }, meta);

    expect(envelope.ok).toBe(true);
    expect(envelope.data).toEqual({ status: "ok" });
    expect(envelope.meta).toEqual(meta);
    expect(Object.keys(envelope)).toEqual(["ok", "data", "meta"]);
  });

  it("creates error envelopes with governed shape", () => {
    const envelope = createErrorEnvelope(
      "validation_failed",
      "Request validation failed.",
      meta,
      { issues: [] }
    );

    expect(envelope.ok).toBe(false);
    expect(envelope.error.code).toBe("validation_failed");
    expect(envelope.error.category).toBe("validation");
    expect(envelope.error.retryable).toBe(false);
    expect(envelope.error.correlationId).toBe(meta.correlationId);
    expect(envelope.meta).toEqual(meta);
    expect(Object.keys(envelope)).toEqual(["ok", "error", "meta"]);
  });
});

describe("API error taxonomy", () => {
  it("maps every error code to an HTTP status", () => {
    for (const code of API_ERROR_CODES) {
      expect(API_ERROR_DEFINITIONS[code].httpStatus).toBeGreaterThanOrEqual(
        400
      );
    }
  });

  it("maps validation failures to HTTP 400", () => {
    expect(API_ERROR_DEFINITIONS.validation_failed.httpStatus).toBe(400);
  });

  it("maps every error code to category and retryable metadata", () => {
    for (const code of API_ERROR_CODES) {
      const definition = API_ERROR_DEFINITIONS[code];
      expect(definition.category.length).toBeGreaterThan(0);
      expect(typeof definition.retryable).toBe("boolean");
    }
  });

  it("maps unauthenticated to HTTP 401", () => {
    expect(API_ERROR_DEFINITIONS.unauthenticated.httpStatus).toBe(401);
  });
});
