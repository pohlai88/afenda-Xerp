import { describe, expect, it } from "vitest";

import {
  POLICY_DECISION_KINDS,
  POLICY_DENIAL_REASONS,
  type PolicyDecisionKind,
  type PolicyDenialReason,
} from "../policy/index.js";

describe("policy vocabulary", () => {
  it("exports serializable policy decision kinds", () => {
    const kinds: PolicyDecisionKind[] = [...POLICY_DECISION_KINDS];
    expect(JSON.parse(JSON.stringify(kinds))).toEqual(kinds);
  });

  it("exports serializable policy denial reasons", () => {
    const reasons: PolicyDenialReason[] = [...POLICY_DENIAL_REASONS];
    expect(JSON.parse(JSON.stringify(reasons))).toEqual(reasons);
  });
});
