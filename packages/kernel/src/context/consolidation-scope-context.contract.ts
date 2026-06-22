import type { ConsolidationTreatment } from "./ownership-interest-context.contract.js";

/** Per-entity consolidation method within a reporting run (authority stub only). */
export interface ConsolidationEntityScope {
  readonly companyId: string;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly ownershipPercentage: number;
}

/**
 * Future reporting boundary derived from entity group + ownership interests.
 * No consolidation arithmetic in this slice.
 */
export interface ConsolidationScopeContext {
  readonly entityGroupId: string;
  readonly legalEntities: readonly ConsolidationEntityScope[];
  readonly reportingDate: string;
  readonly tenantId: string;
}
