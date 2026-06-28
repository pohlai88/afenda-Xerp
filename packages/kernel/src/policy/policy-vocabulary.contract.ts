/**
 * PAS-001 §4.9 — policy decision vocabulary authority and ownership metadata.
 * Vocabulary only — no evaluation, entitlements, HTTP mapping, or persistence.
 */

import {
  isPolicyDecisionKind,
  type PolicyDecisionKind,
} from "./policy-decision.contract.js";
import {
  isPolicyDenialReason,
  type PolicyDenialReason,
} from "./policy-denial-reason.contract.js";

export const POLICY_VOCABULARY_AUTHORITY = {
  pas: "PAS-001",
  section: "4.9",
} as const;

export const POLICY_VOCABULARY_OWNERSHIP = [
  { concern: "policy decision vocabulary", owner: "kernel" },
  { concern: "policy evaluation", owner: "@afenda/permissions" },
  {
    concern: "commercial plan and capability evaluation",
    owner: "@afenda/entitlements",
  },
  { concern: "HTTP mapping", owner: "API governance" },
  { concern: "route/action enforcement", owner: "ERP" },
  { concern: "role/permission persistence", owner: "Database" },
] as const;

export function getPolicyDecisionKind(
  value: string
): PolicyDecisionKind | null {
  if (!isPolicyDecisionKind(value)) {
    return null;
  }
  return value;
}

export function getPolicyDenialReason(
  value: string
): PolicyDenialReason | null {
  if (!isPolicyDenialReason(value)) {
    return null;
  }
  return value;
}
