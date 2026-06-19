import type { FeatureFlagKey } from "./feature-flag.contract";
import type { FlagDenialReason } from "./feature-flag-decision.contract";

/** Audit record emitted when a feature-flag gate is evaluated. */
export interface FeatureFlagAuditContract {
  readonly companyId: string;
  readonly correlationId: string;
  readonly evaluatedAt: string;
  readonly key: FeatureFlagKey;
  readonly reason: FlagDenialReason | "allowed";
  readonly tenantId: string;
}
