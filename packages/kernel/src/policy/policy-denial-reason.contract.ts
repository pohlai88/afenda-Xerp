/** Policy denial reason vocabulary — evaluation lives in @afenda/permissions. */

export type PolicyDenialReason =
  | "unauthorized"
  | "forbidden"
  | "rate_limited"
  | "quota_exceeded"
  | "feature_disabled"
  | "plan_required"
  | "context_required"
  | "tenant_suspended"
  | "outside_scope";
