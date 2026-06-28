import { describe, expect, it } from "vitest";

import {
  assertWirePolicyDecision,
  type PolicyDecision,
  parseUnknownPolicyDecision,
  serializePolicyDecision,
} from "../index.js";

describe("policy decision wire triad", () => {
  const allowDecision: PolicyDecision = { kind: "allow" };
  const denyDecision: PolicyDecision = {
    kind: "deny",
    reason: "unauthorized",
  };
  const deferWithReason: PolicyDecision = {
    kind: "defer",
    reason: "context_required",
  };

  it("parses unknown wire payloads into typed policy decisions", () => {
    expect(parseUnknownPolicyDecision({ kind: "allow" })).toEqual(
      allowDecision
    );
    expect(
      parseUnknownPolicyDecision({ kind: "deny", reason: "forbidden" })
    ).toEqual({
      kind: "deny",
      reason: "forbidden",
    });
    expect(parseUnknownPolicyDecision({ kind: "defer" })).toEqual({
      kind: "defer",
    });
  });

  it("round-trips typed decisions through serialize and parseUnknown", () => {
    const samples: PolicyDecision[] = [
      allowDecision,
      denyDecision,
      { kind: "gate", reason: "plan_required" },
      { kind: "defer" },
      deferWithReason,
    ];

    for (const sample of samples) {
      const wire = serializePolicyDecision(sample);
      expect(parseUnknownPolicyDecision(wire)).toEqual(sample);
    }
  });

  it("rejects wire payloads with unexpected keys via assertWirePolicyDecision", () => {
    expect(() =>
      assertWirePolicyDecision({ kind: "allow", extra: true })
    ).toThrow(/unexpected keys/i);
    expect(() =>
      assertWirePolicyDecision({
        kind: "deny",
        reason: "forbidden",
        extra: true,
      })
    ).toThrow(/unexpected keys/i);
    expect(() =>
      assertWirePolicyDecision({
        kind: "defer",
        reason: "outside_scope",
        extra: true,
      })
    ).toThrow(/unexpected keys/i);
  });

  it("rejects malformed wire payloads before parseUnknown", () => {
    expect(() => parseUnknownPolicyDecision(null)).toThrow();
    expect(() => parseUnknownPolicyDecision({ kind: "deny" })).toThrow();
    expect(() =>
      parseUnknownPolicyDecision({ kind: "deny", reason: "invalid_reason" })
    ).toThrow();
  });
});
