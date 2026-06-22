import { describe, expect, it } from "vitest";

import {
  isApiPolicyGatedEnvelope,
  readApiPolicyGateDecision,
} from "../api-envelope.client";

describe("readApiPolicyGateDecision", () => {
  it("returns gate decision from forbidden envelope details", () => {
    const envelope = {
      ok: false as const,
      error: {
        code: "forbidden" as const,
        correlationId: "corr-1",
        message: "Policy requires approval.",
        details: { gateDecision: "require_approval" },
      },
      meta: {
        correlationId: "corr-1",
        requestId: "req-1",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    };

    expect(readApiPolicyGateDecision(envelope)).toBe("require_approval");
    expect(isApiPolicyGatedEnvelope(envelope)).toBe(true);
  });

  it("returns null when details omit gateDecision", () => {
    const envelope = {
      ok: false as const,
      error: {
        code: "forbidden" as const,
        correlationId: "corr-1",
        message: "Forbidden.",
        details: { denialCode: "permission_denied" },
      },
      meta: {
        correlationId: "corr-1",
        requestId: "req-1",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    };

    expect(readApiPolicyGateDecision(envelope)).toBeNull();
    expect(isApiPolicyGatedEnvelope(envelope)).toBe(false);
  });
});
