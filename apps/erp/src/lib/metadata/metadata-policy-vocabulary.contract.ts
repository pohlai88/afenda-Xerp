/**
 * PAS-001 §4.9 — ERP metadata policy decision vocabulary (kernel authority mirror).
 * ADR-0027: replaces retired @afenda/ui-composition metadata policy contracts.
 */

import {
  isPolicyDecisionKind,
  isPolicyDenialReason,
  POLICY_DECISION_KINDS,
  POLICY_DENIAL_REASONS,
  type PolicyDecisionKind,
  type PolicyDenialReason,
} from "@afenda/kernel";

export type MetadataRuntimePolicyDecisionKind = PolicyDecisionKind;
export type MetadataRuntimePolicyDenialReason = PolicyDenialReason;

export const METADATA_RUNTIME_POLICY_DECISION_KINDS = POLICY_DECISION_KINDS;
export const METADATA_RUNTIME_POLICY_DENIAL_REASONS = POLICY_DENIAL_REASONS;

export function isMetadataRuntimePolicyDecisionKind(
  value: string
): value is MetadataRuntimePolicyDecisionKind {
  return isPolicyDecisionKind(value);
}

export function isMetadataRuntimePolicyDenialReason(
  value: string
): value is MetadataRuntimePolicyDenialReason {
  return isPolicyDenialReason(value);
}
