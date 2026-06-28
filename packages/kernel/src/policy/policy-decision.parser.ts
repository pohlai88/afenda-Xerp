import {
  assertPolicyDecision,
  assertWirePolicyDecision,
} from "./policy-decision.assert.js";
import type {
  PolicyDecision,
  PolicyWireDecision,
} from "./policy-decision.contract.js";
import {
  isPolicyDenialReason,
  type PolicyDenialReason,
} from "./policy-denial-reason.contract.js";

function requirePolicyDenialReason(
  value: string,
  label: string
): PolicyDenialReason {
  if (!isPolicyDenialReason(value)) {
    throw new Error(`${label} must be a valid policy denial reason.`);
  }

  return value;
}

function parseValidatedPolicyDecision(
  value: PolicyWireDecision
): PolicyDecision {
  switch (value.kind) {
    case "allow":
      return { kind: "allow" };
    case "deny":
      return {
        kind: "deny",
        reason: requirePolicyDenialReason(value.reason, "reason"),
      };
    case "gate":
      return {
        kind: "gate",
        reason: requirePolicyDenialReason(value.reason, "reason"),
      };
    case "defer":
      return value.reason === undefined
        ? { kind: "defer" }
        : {
            kind: "defer",
            reason: requirePolicyDenialReason(value.reason, "reason"),
          };
    default: {
      const _exhaustive: never = value;
      throw new Error(`Unknown policy decision kind: ${String(_exhaustive)}.`);
    }
  }
}

/** JSON/API ingress — assert unknown wire, then narrow to typed policy decision. */
export function parseUnknownPolicyDecision(value: unknown): PolicyDecision {
  assertWirePolicyDecision(value);
  return parseValidatedPolicyDecision(value);
}

export function normalizePolicyDecisionForWire(
  value: PolicyDecision
): PolicyWireDecision {
  const validated = assertPolicyDecision(value);

  switch (validated.kind) {
    case "allow":
      return { kind: "allow" };
    case "deny":
      return { kind: "deny", reason: validated.reason };
    case "gate":
      return { kind: "gate", reason: validated.reason };
    case "defer":
      return validated.reason === undefined
        ? { kind: "defer" }
        : { kind: "defer", reason: validated.reason };
    default: {
      const _exhaustive: never = validated;
      throw new Error(`Unknown policy decision kind: ${String(_exhaustive)}.`);
    }
  }
}

/** Wire egress alias — same contract as `normalizePolicyDecisionForWire`. */
export function serializePolicyDecision(
  value: PolicyDecision
): PolicyWireDecision {
  return normalizePolicyDecisionForWire(value);
}
