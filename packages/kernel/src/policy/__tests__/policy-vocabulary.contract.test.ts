import { describe, expect, it } from "vitest";

import {
  assertPolicyDecision,
  assertWirePolicyDecision,
  getPolicyDecisionKind,
  getPolicyDenialReason,
  isPolicyDecision,
  isPolicyDecisionKind,
  isPolicyDenialReason,
  normalizePolicyDecisionForWire,
  POLICY_DECISION_KINDS,
  POLICY_DENIAL_REASONS,
  POLICY_VOCABULARY_AUTHORITY,
  POLICY_VOCABULARY_OWNERSHIP,
  type PolicyDecision,
  type PolicyDecisionKind,
  type PolicyDenialReason,
  type PolicyWireDecision,
  parseUnknownPolicyDecision,
  serializePolicyDecision,
} from "../index.js";

const MANUAL_DECISION_KINDS: PolicyDecisionKind[] = [
  "allow",
  "deny",
  "gate",
  "defer",
];

const MANUAL_DENIAL_REASONS: PolicyDenialReason[] = [
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

describe("policy vocabulary registry", () => {
  it("locks policy decision kind registry length at four", () => {
    expect(POLICY_DECISION_KINDS).toHaveLength(4);
    expect(POLICY_DECISION_KINDS).toEqual(MANUAL_DECISION_KINDS);
  });

  it("locks policy denial reason registry length at nine", () => {
    expect(POLICY_DENIAL_REASONS).toHaveLength(9);
    expect(POLICY_DENIAL_REASONS).toEqual(MANUAL_DENIAL_REASONS);
  });

  it("accepts every registry kind via type guard", () => {
    for (const kind of POLICY_DECISION_KINDS) {
      expect(isPolicyDecisionKind(kind)).toBe(true);
    }
  });

  it("accepts every registry reason via type guard", () => {
    for (const reason of POLICY_DENIAL_REASONS) {
      expect(isPolicyDenialReason(reason)).toBe(true);
    }
  });

  it("rejects invalid kind and reason strings", () => {
    expect(isPolicyDecisionKind("permit")).toBe(false);
    expect(isPolicyDenialReason("not_allowed")).toBe(false);
    expect(getPolicyDecisionKind("permit")).toBeNull();
    expect(getPolicyDenialReason("not_allowed")).toBeNull();
  });

  it("narrows valid strings via get helpers", () => {
    expect(getPolicyDecisionKind("allow")).toBe("allow");
    expect(getPolicyDenialReason("forbidden")).toBe("forbidden");
  });
});

describe("policy vocabulary authority metadata", () => {
  it("matches PAS-001 §4.9 authority pointer", () => {
    expect(POLICY_VOCABULARY_AUTHORITY).toEqual({
      pas: "PAS-001",
      section: "4.9",
    });
  });

  it("documents PAS §4.9 ownership split", () => {
    expect(POLICY_VOCABULARY_OWNERSHIP).toEqual([
      { concern: "policy decision vocabulary", owner: "kernel" },
      { concern: "policy evaluation", owner: "@afenda/permissions" },
      {
        concern: "commercial plan and capability evaluation",
        owner: "@afenda/entitlements",
      },
      { concern: "HTTP mapping", owner: "API governance" },
      { concern: "route/action enforcement", owner: "ERP" },
      { concern: "role/permission persistence", owner: "Database" },
    ]);
  });
});

describe("PolicyDecision discriminated union", () => {
  const allowDecision: PolicyDecision = { kind: "allow" };
  const denyDecision: PolicyDecision = {
    kind: "deny",
    reason: "unauthorized",
  };
  const gateDecision: PolicyDecision = {
    kind: "gate",
    reason: "plan_required",
  };
  const deferWithoutReason: PolicyDecision = { kind: "defer" };
  const deferWithReason: PolicyDecision = {
    kind: "defer",
    reason: "context_required",
  };

  it("accepts allow without reason", () => {
    expect(isPolicyDecision(allowDecision)).toBe(true);
  });

  it("requires reason for deny and gate", () => {
    expect(isPolicyDecision(denyDecision)).toBe(true);
    expect(isPolicyDecision(gateDecision)).toBe(true);
    expect(isPolicyDecision({ kind: "deny" })).toBe(false);
    expect(isPolicyDecision({ kind: "gate" })).toBe(false);
    expect(isPolicyDecision({ kind: "deny", reason: "invalid_reason" })).toBe(
      false
    );
  });

  it("accepts defer with optional reason", () => {
    expect(isPolicyDecision(deferWithoutReason)).toBe(true);
    expect(isPolicyDecision(deferWithReason)).toBe(true);
    expect(isPolicyDecision({ kind: "defer", reason: "invalid_reason" })).toBe(
      false
    );
  });

  it("rejects malformed wire payloads", () => {
    expect(isPolicyDecision(null)).toBe(false);
    expect(isPolicyDecision("allow")).toBe(false);
    expect(isPolicyDecision({ kind: "unknown" })).toBe(false);
    expect(isPolicyDecision({ kind: "allow", extra: true })).toBe(true);
  });

  it("round-trips sample decisions through JSON", () => {
    const samples: PolicyDecision[] = [
      allowDecision,
      denyDecision,
      gateDecision,
      deferWithoutReason,
      deferWithReason,
    ];

    for (const sample of samples) {
      const parsed: unknown = JSON.parse(JSON.stringify(sample));
      expect(isPolicyDecision(parsed)).toBe(true);
      expect(parsed).toEqual(sample);
    }
  });
});

describe("policy decision wire triad exports", () => {
  it("exports wire triad symbols from policy barrel", () => {
    expect(typeof assertPolicyDecision).toBe("function");
    expect(typeof assertWirePolicyDecision).toBe("function");
    expect(typeof parseUnknownPolicyDecision).toBe("function");
    expect(typeof normalizePolicyDecisionForWire).toBe("function");
    expect(typeof serializePolicyDecision).toBe("function");
  });

  it("normalizes typed decisions to JSON-safe wire shapes", () => {
    const wire: PolicyWireDecision = normalizePolicyDecisionForWire({
      kind: "deny",
      reason: "forbidden",
    });

    expect(wire).toEqual({ kind: "deny", reason: "forbidden" });
    expect(serializePolicyDecision({ kind: "allow" })).toEqual({
      kind: "allow",
    });
  });

  it("assertPolicyDecision validates typed decisions", () => {
    const decision: PolicyDecision = { kind: "gate", reason: "plan_required" };
    expect(assertPolicyDecision(decision)).toEqual(decision);
  });
});

describe("registry-derived types exhaustiveness", () => {
  it("matches manual decision kind arrays", () => {
    const derived: PolicyDecisionKind[] = [...POLICY_DECISION_KINDS];
    expect(derived).toEqual(MANUAL_DECISION_KINDS);
  });

  it("matches manual denial reason arrays", () => {
    const derived: PolicyDenialReason[] = [...POLICY_DENIAL_REASONS];
    expect(derived).toEqual(MANUAL_DENIAL_REASONS);
  });
});
