import type { EntitlementAuditContract } from "./entitlement-audit.contract";

export type EntitlementDecisionResult =
  | "allow"
  | "disabled"
  | "beta_required"
  | "localization_required"
  | "limit_exceeded"
  | "not_entitled"
  | "kill_switch_active";

export interface EntitlementDecisionContract {
  readonly audit: EntitlementAuditContract | null;
  readonly capabilityKey: string;
  readonly reason: string;
  readonly result: EntitlementDecisionResult;
}

export const entitlementDecisionResults = [
  "allow",
  "disabled",
  "beta_required",
  "localization_required",
  "limit_exceeded",
  "not_entitled",
  "kill_switch_active",
] as const satisfies readonly EntitlementDecisionResult[];
