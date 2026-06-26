import { describe, expect, it } from "vitest";
import { createTestApiErrorEnvelope } from "@/server/api/__tests__/api-test-envelope";
import {
  isApiPolicyGatedEnvelope,
  readApiPolicyGateDecision,
} from "../api-envelope.client";

describe("readApiPolicyGateDecision", () => {
  it("returns gate decision from forbidden envelope details", () => {
    const envelope = createTestApiErrorEnvelope(
      {
        code: "forbidden",
        correlationId: "corr-1",
        message: "Policy requires approval.",
        details: { gateDecision: "require_approval" },
      },
      { requestId: "req-1" }
    );

    expect(readApiPolicyGateDecision(envelope)).toBe("require_approval");
    expect(isApiPolicyGatedEnvelope(envelope)).toBe(true);
  });

  it("returns null when details omit gateDecision", () => {
    const envelope = createTestApiErrorEnvelope(
      {
        code: "forbidden",
        correlationId: "corr-1",
        message: "Forbidden.",
        details: { denialCode: "permission_denied" },
      },
      { requestId: "req-1" }
    );

    expect(readApiPolicyGateDecision(envelope)).toBeNull();
    expect(isApiPolicyGatedEnvelope(envelope)).toBe(false);
  });
});
