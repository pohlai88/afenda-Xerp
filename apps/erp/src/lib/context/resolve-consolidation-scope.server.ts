import type { AfendaDatabase } from "@afenda/database";
import type {
  ConsolidationScopeContext,
  EntityGroupContext,
  OwnershipInterestContext,
} from "@afenda/kernel";

import { deriveConsolidationScopeContext } from "./consolidation-scope-resolution.server";
import { loadOperatingContextOwnershipInterests } from "./load-operating-context-ownership-interests.server";

export interface ResolvedConsolidationScope {
  readonly consolidationScope: ConsolidationScopeContext | null;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
}

/**
 * Governed ERP boundary for consolidation scope (kernel metadata only).
 * Loads ownership interests from database lookup services and derives scope metadata only.
 */
export async function resolveConsolidationScope(input: {
  readonly db?: AfendaDatabase;
  readonly entityGroup: EntityGroupContext | null;
  /** Entity group uuid PK for database FK filters. */
  readonly entityGroupPk: string | null;
  readonly reportingDate: string;
  readonly tenantEnterpriseId: string;
  /** Tenant uuid PK for database FK filters. */
  readonly tenantPk: string;
}): Promise<ResolvedConsolidationScope> {
  const ownershipInterests = await loadOperatingContextOwnershipInterests({
    tenantPk: input.tenantPk,
    entityGroupPk: input.entityGroupPk,
    effectiveOn: input.reportingDate,
    ...(input.db === undefined ? {} : { db: input.db }),
  });

  const consolidationScope = input.entityGroup
    ? deriveConsolidationScopeContext({
        tenantId: input.tenantEnterpriseId,
        entityGroupId: input.entityGroup.entityGroupId,
        ownershipInterests,
        reportingDate: input.reportingDate,
      })
    : null;

  return { consolidationScope, ownershipInterests };
}
