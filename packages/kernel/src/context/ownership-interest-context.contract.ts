import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

export const OWNERSHIP_CONTROL_TYPES = [
  "control",
  "significant_influence",
  "joint_control",
  "passive_investment",
] as const;

export type OwnershipControlType = (typeof OWNERSHIP_CONTROL_TYPES)[number];

export const CONSOLIDATION_TREATMENTS = [
  "full_consolidation",
  "equity_method",
  "proportionate_consolidation",
  "fair_value_or_cost",
  "excluded",
] as const;

export type ConsolidationTreatment = (typeof CONSOLIDATION_TREATMENTS)[number];

/**
 * Parent/investee relationship authority stub (TIP-008).
 * Wire-format context — plain string ids for JSON serialization.
 * Canonical investee field: `childLegalEntityId` (see hierarchy-id-boundary.contract.ts).
 * No consolidation arithmetic in this slice.
 */
export type OwnershipInterestWireContext = OwnershipInterestContext;

export interface OwnershipInterestContext {
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

  if (interest.effectiveFrom > effectiveOn) {
    return false;
  }

  return interest.effectiveTo === null || interest.effectiveTo >= effectiveOn;
}
