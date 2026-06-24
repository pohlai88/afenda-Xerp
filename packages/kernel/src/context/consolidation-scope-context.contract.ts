import type { ConsolidationTreatment } from "./ownership-interest-context.contract.js";

/** Per-entity consolidation method within a reporting run (scope metadata only). */
export interface ConsolidationEntityScope {
  readonly companyId: string;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly ownershipPercentage: number;
}

/**
 * Future reporting boundary derived from entity group + ownership interests.
 * Wire-format context — plain string ids for JSON serialization.
 * No consolidation arithmetic in this slice.
 *
 * When multiple interests share an investee company id, dedup policy is
 * `CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY` (last-wins by input order).
 */
export type ConsolidationScopeWireContext = ConsolidationScopeContext;

export interface ConsolidationScopeContext {
  readonly entityGroupId: string;
  readonly legalEntities: readonly ConsolidationEntityScope[];
  readonly reportingDate: string;
  readonly tenantId: string;
}
