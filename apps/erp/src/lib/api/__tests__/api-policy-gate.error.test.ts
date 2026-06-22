import { describe, expect, it } from "vitest";

import {
  ApiPolicyGateError,
  assertApiSuccessEnvelope,
  createApiClientErrorFromEnvelope,
  isApiPolicyGateError,
} from "../api-policy-gate.error";

describe("createApiClientErrorFromEnvelope", () => {
  it("returns ApiPolicyGateError when forbidden envelope includes gateDecision", () => {
    const envelope = {
      ok: false as const,
      error: {
        code: "forbidden" as const,
        correlationId: "corr-gate-1",
        message: "Policy requires approval.",
        details: { gateDecision: "require_approval" },
      },
      meta: {
        correlationId: "corr-gate-1",
        requestId: "req-gate-1",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    };

    const error = createApiClientErrorFromEnvelope(
      envelope,
      "Request failed."
    );

    expect(error).toBeInstanceOf(ApiPolicyGateError);
    expect(isApiPolicyGateError(error)).toBe(true);
    if (isApiPolicyGateError(error)) {
      expect(error.gateDecision).toBe("require_approval");
      expect(error.correlationId).toBe("corr-gate-1");
      expect(error.message).toBe("Policy requires approval.");
    }
  });

  it("returns ApiClientRequestError for non-gated forbidden responses", () => {
    const envelope = {
      ok: false as const,
      error: {
        code: "forbidden" as const,
        correlationId: "corr-deny-1",
        message: "Permission denied.",
        details: { denialCode: "permission_denied" },
      },
      meta: {
        correlationId: "corr-deny-1",
        requestId: "req-deny-1",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    };

    const error = createApiClientErrorFromEnvelope(
      envelope,
      "Request failed."
    );

    expect(isApiPolicyGateError(error)).toBe(false);
    expect(error.code).toBe("forbidden");
    expect(error.message).toBe("Permission denied.");
  });
});

describe("assertApiSuccessEnvelope", () => {
  it("returns data for success envelopes", () => {
    const envelope = {
      ok: true as const,
      data: { value: 42 },
      meta: {
        correlationId: "corr-ok-1",
        requestId: "req-ok-1",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    };

    expect(assertApiSuccessEnvelope(envelope, "Request failed.")).toEqual({
      value: 42,
    });
  });

  it("throws ApiPolicyGateError for gated error envelopes", () => {
    const envelope = {
      ok: false as const,
      error: {
        code: "forbidden" as const,
        correlationId: "corr-gate-2",
        message: "Step-up required.",
        details: { gateDecision: "require_step_up" },
      },
      meta: {
        correlationId: "corr-gate-2",
        requestId: "req-gate-2",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    };

    expect(() =>
      assertApiSuccessEnvelope(envelope, "Request failed.")
    ).toThrow(ApiPolicyGateError);
  });
});
