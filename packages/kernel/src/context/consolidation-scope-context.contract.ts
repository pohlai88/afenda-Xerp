import type { CompanyId, EntityGroupId, TenantId } from "../identity/index.js";
import type {
  ConsolidationTreatment,
  PercentageNumber,
} from "./ownership-interest-context.contract.js";

/**
 * Per-entity consolidation treatment within a reporting run — scope metadata only.
 *
 * Kernel does not own consolidation arithmetic, elimination entries, or NCI calculation.
 */
export interface ConsolidationEntityScope {
  readonly companyId: CompanyId;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly ownershipPercentage: PercentageNumber;
}

/** JSON/wire format for a single investee legal entity scope row. */
export interface ConsolidationEntityScopeWire {
  readonly companyId: string;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly ownershipPercentage: number;
}

/**
 * Reporting boundary derived from entity group + ownership interests.
 *
 * Kernel owns scope metadata and branded identity slots only.
 * Kernel does not own consolidation arithmetic, elimination entries, or NCI calculation.
 *
 * When multiple interests share an investee company id, dedup policy is owned by
 * apps/erp (`CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY` — last-wins by input order).
 */
export interface ConsolidationScopeContext {
  readonly entityGroupId: EntityGroupId;
  readonly legalEntities: readonly ConsolidationEntityScope[];
  readonly reportingDate: string;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface ConsolidationScopeWireContext {
  readonly entityGroupId: string;
  readonly legalEntities: readonly ConsolidationEntityScopeWire[];
  readonly reportingDate: string;
  readonly tenantId: string;
}
