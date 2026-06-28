import { describe, expect, it } from "vitest";

import {
  formatMetadataRuntimePolicyDecision,
  isMetadataRuntimePolicyDecisionKind,
  isMetadataRuntimePolicyDenialReason,
  METADATA_RUNTIME_POLICY_DECISION_KINDS,
  METADATA_RUNTIME_POLICY_DENIAL_REASONS,
  type MetadataRuntimePolicyDecision,
} from "../metadata-policy-vocabulary.contract.js";

describe("metadata policy vocabulary (PAS-001 §4.9 consumer projection)", () => {
  it("locks decision kinds and denial reasons to kernel parity lengths", () => {
    expect(METADATA_RUNTIME_POLICY_DECISION_KINDS).toHaveLength(4);
    expect(METADATA_RUNTIME_POLICY_DENIAL_REASONS).toHaveLength(9);
  });

  it("accepts registry literals via type guards", () => {
    for (const kind of METADATA_RUNTIME_POLICY_DECISION_KINDS) {
      expect(isMetadataRuntimePolicyDecisionKind(kind)).toBe(true);
    }

    for (const reason of METADATA_RUNTIME_POLICY_DENIAL_REASONS) {
      expect(isMetadataRuntimePolicyDenialReason(reason)).toBe(true);
    }
  });

  it("formats wire decisions for diagnostics surfaces", () => {
    const allow: MetadataRuntimePolicyDecision = { kind: "allow" };
    const gate: MetadataRuntimePolicyDecision = {
      kind: "gate",
      reason: "plan_required",
    };

    expect(formatMetadataRuntimePolicyDecision(allow)).toBe("allow");
    expect(formatMetadataRuntimePolicyDecision(gate)).toBe(
      "gate:plan_required"
    );
  });

  it("round-trips sample decisions through JSON", () => {
    const samples: MetadataRuntimePolicyDecision[] = [
      { kind: "allow" },
      { kind: "deny", reason: "unauthorized" },
      { kind: "gate", reason: "forbidden" },
      { kind: "defer", reason: "context_required" },
      { kind: "defer" },
    ];

    for (const sample of samples) {
      expect(JSON.parse(JSON.stringify(sample))).toEqual(sample);
    }
  });
});
