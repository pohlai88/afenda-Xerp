/** Policy decision vocabulary — evaluation lives in @afenda/permissions. */

import {
  isPolicyDenialReason,
  type PolicyDenialReason,
} from "./policy-denial-reason.contract.js";

export const POLICY_DECISION_KINDS = [
  "allow",
  "deny",
  "gate",
  "defer",
] as const;

export type PolicyDecisionKind = (typeof POLICY_DECISION_KINDS)[number];

const KIND_SET = new Set<string>(POLICY_DECISION_KINDS);

export function isPolicyDecisionKind(
  value: string
): value is PolicyDecisionKind {
  return KIND_SET.has(value);
}

export type PolicyDecision =
  | { readonly kind: "allow" }
  | { readonly kind: "deny"; readonly reason: PolicyDenialReason }
  | { readonly kind: "gate"; readonly reason: PolicyDenialReason }
  | { readonly kind: "defer"; readonly reason?: PolicyDenialReason };

export function isPolicyDecision(value: unknown): value is PolicyDecision {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const kind = record["kind"];

  if (typeof kind !== "string" || !isPolicyDecisionKind(kind)) {
    return false;
  }

  const reason = record["reason"];

  if (kind === "allow") {
    return reason === undefined;
  }

  if (kind === "deny" || kind === "gate") {
    return typeof reason === "string" && isPolicyDenialReason(reason);
  }

  return (
    reason === undefined ||
    (typeof reason === "string" && isPolicyDenialReason(reason))
  );
}
