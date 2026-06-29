import { describe, expect, it } from "vitest";

import {
  API_ERROR_CODES,
  API_ERROR_DEFINITIONS,
  projectProblemDetailClass,
} from "@/server/api/contracts/api-error.contract";
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
} from "@/server/api/runtime/api-correlation";
import {
  createErrorEnvelope,
  createSuccessEnvelope,
  jsonErrorResponse,
  jsonSuccessResponse,
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

  it("projects ProblemDetail-class fields for every governed error code", () => {
    for (const code of API_ERROR_CODES) {
      const projection = projectProblemDetailClass(code);
      const definition = API_ERROR_DEFINITIONS[code];

      expect(projection.status).toBe(definition.httpStatus);
      expect(projection.title).toBe(definition.publicMessage);
      expect(projection.type).toBe(`https://afenda.dev/problems/${code}`);
      expect(projection.status).toBeGreaterThanOrEqual(400);
    }
  });

  it("serializes governed error responses with correlation headers", async () => {
    const meta = {
      correlationId: "corr-problem-detail",
      requestId: "req-problem-detail",
      timestamp: "2026-06-30T00:00:00.000Z",
    };

    const response = jsonErrorResponse(
      "validation_failed",
      "Request validation failed.",
      meta,
      { issues: [] }
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-Type")).toContain("application/json");
    expect(response.headers.get(CORRELATION_ID_HEADER)).toBe(meta.correlationId);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(meta.requestId);

    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: false,
      error: {
        category: "validation",
        code: "validation_failed",
        correlationId: meta.correlationId,
        message: "Request validation failed.",
        retryable: false,
      },
      meta,
    });
  });

  it("serializes success responses with governed envelope and trace headers", async () => {
    const meta = {
      correlationId: "corr-success",
      requestId: "req-success",
      timestamp: "2026-06-30T00:00:00.000Z",
    };

    const response = jsonSuccessResponse(
      { status: "ok" },
      meta,
      { kind: "no-store" }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get(CORRELATION_ID_HEADER)).toBe(meta.correlationId);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(meta.requestId);

    const body: unknown = await response.json();
    expect(body).toEqual({
      ok: true,
      data: { status: "ok" },
      meta,
    });
  });
});
