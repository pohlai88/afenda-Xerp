import { describe, expect, it } from "vitest";
import type { PolicyDecisionKind } from "../policy/policy-decision.contract.js";
import type { PolicyDenialReason } from "../policy/policy-denial-reason.contract.js";

describe("policy vocabulary", () => {
  it("exports serializable policy decision kinds", () => {
    const kinds: PolicyDecisionKind[] = ["allow", "deny", "gate", "defer"];
    expect(JSON.parse(JSON.stringify(kinds))).toEqual(kinds);
  });

  it("exports serializable policy denial reasons", () => {
    const reasons: PolicyDenialReason[] = [
      "unauthorized",
      "forbidden",
      "rate_limited",
      "quota_exceeded",
      "feature_disabled",
      "plan_required",
      "context_required",
      "tenant_suspended",
      "outside_scope",
    ];
    expect(JSON.parse(JSON.stringify(reasons))).toEqual(reasons);
  });
});
