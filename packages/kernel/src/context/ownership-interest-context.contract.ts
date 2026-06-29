import type {
  CompanyId,
  EntityGroupId,
  OwnershipInterestId,
  TenantId,
} from "../identity/index.js";
import { isRecordEffectiveAt } from "./effective-dating-vocabulary.contract.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

export const OWNERSHIP_CONTROL_TYPES = [
  "control",
  "significant_influence",
  "joint_control",
  "passive_investment",
] as const;

export type OwnershipControlType = (typeof OWNERSHIP_CONTROL_TYPES)[number];

/** Branded 0–100 percentage — assert and brand at wire ingress via parser. */
export type PercentageNumber = number & {
  readonly __brand: "PercentageNumber";
};

export const CONSOLIDATION_TREATMENTS = [
  "full_consolidation",
  "equity_method",
  "proportionate_consolidation",
  "fair_value_or_cost",
  "excluded",
  /** Ambiguous or jurisdiction-specific — requires explicit policy before consolidation. */
  "policy_review_required",
] as const;

export type ConsolidationTreatment = (typeof CONSOLIDATION_TREATMENTS)[number];

/**
 * Parent/investee ownership interest — consolidation-readiness metadata only.
 *
 * Kernel owns relationship vocabulary and branded identity slots.
 * Kernel does not own consolidation arithmetic, elimination entries, or NCI calculation.
 *
 * Canonical investee field: `childLegalEntityId`.
 */
export interface OwnershipInterestContext {
  readonly childLegalEntityId: CompanyId;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly controlType: OwnershipControlType;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly entityGroupId: EntityGroupId;
  readonly nonControllingInterestApplicable: boolean;
  readonly ownershipInterestId: OwnershipInterestId;
  readonly ownershipPercentage: PercentageNumber;
  readonly parentLegalEntityId: CompanyId;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: TenantId;
  readonly votingPercentage: PercentageNumber;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface OwnershipInterestWireContext {
  readonly childLegalEntityId: string;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly controlType: OwnershipControlType;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly entityGroupId: string;
  readonly nonControllingInterestApplicable: boolean;
  readonly ownershipInterestId: string;
  readonly ownershipPercentage: number;
  readonly parentLegalEntityId: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
  readonly votingPercentage: number;
}

/** @deprecated Use `OwnershipInterestContext` — retained for hierarchy-id-boundary callers. */
export type BrandedOwnershipInterestContext = OwnershipInterestContext;

export function isOwnershipInterestEffectiveAt(
  interest: Pick<
    OwnershipInterestContext,
    "effectiveFrom" | "effectiveTo" | "status"
  >,
  effectiveOn: string
): boolean {
  if (interest.status !== "active") {
    return false;
  }

  return isRecordEffectiveAt(
    interest.effectiveFrom,
    interest.effectiveTo,
    effectiveOn
  );
}
