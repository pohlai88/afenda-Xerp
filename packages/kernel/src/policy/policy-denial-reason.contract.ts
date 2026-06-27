/** Policy denial reason vocabulary — evaluation lives in @afenda/permissions. */

export const POLICY_DENIAL_REASONS = [
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

export type PolicyDenialReason = (typeof POLICY_DENIAL_REASONS)[number];

const REASON_SET = new Set<string>(POLICY_DENIAL_REASONS);

export function isPolicyDenialReason(
  value: string
): value is PolicyDenialReason {
  return REASON_SET.has(value);
}
