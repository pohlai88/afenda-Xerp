/**
 * Metadata runtime policy decision wire vocabulary (PAS-001 §4.9 consumer projection).
 *
 * Structural mirror of `@afenda/kernel` `PolicyWireDecision` — evaluation remains in
 * `@afenda/permissions`; ERP maps verified operating context at the trust boundary.
 */

export const METADATA_RUNTIME_POLICY_DECISION_KINDS = [
  "allow",
  "deny",
  "gate",
  "defer",
] as const;

export type MetadataRuntimePolicyDecisionKind =
  (typeof METADATA_RUNTIME_POLICY_DECISION_KINDS)[number];

export const METADATA_RUNTIME_POLICY_DENIAL_REASONS = [
  "unauthorized",
  "forbidden",
  "rate_limited",
  "quota_exceeded",
  "feature_disabled",
  "plan_required",
  "context_required",
  "tenant_suspended",
  "outside_scope",
] as const;

export type MetadataRuntimePolicyDenialReason =
  (typeof METADATA_RUNTIME_POLICY_DENIAL_REASONS)[number];

/** JSON-safe policy decision carrier for metadata runtime and diagnostics. */
export type MetadataRuntimePolicyDecision =
  | { readonly kind: "allow" }
  | {
      readonly kind: "deny";
      readonly reason: MetadataRuntimePolicyDenialReason;
    }
  | {
      readonly kind: "gate";
      readonly reason: MetadataRuntimePolicyDenialReason;
    }
  | {
      readonly kind: "defer";
      readonly reason?: MetadataRuntimePolicyDenialReason;
    };

export function isMetadataRuntimePolicyDecisionKind(
  value: string
): value is MetadataRuntimePolicyDecisionKind {
  return (METADATA_RUNTIME_POLICY_DECISION_KINDS as readonly string[]).includes(
    value
  );
}

export function isMetadataRuntimePolicyDenialReason(
  value: string
): value is MetadataRuntimePolicyDenialReason {
  return (METADATA_RUNTIME_POLICY_DENIAL_REASONS as readonly string[]).includes(
    value
  );
}

export function formatMetadataRuntimePolicyDecision(
  decision: MetadataRuntimePolicyDecision
): string {
  if (decision.kind === "allow") {
    return "allow";
  }

  if (decision.reason === undefined) {
    return decision.kind;
  }

  return `${decision.kind}:${decision.reason}`;
}
