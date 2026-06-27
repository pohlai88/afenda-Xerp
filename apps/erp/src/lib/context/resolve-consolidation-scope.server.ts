import type { AfendaDatabase } from "@afenda/database";
import type {
  ConsolidationScopeContext,
  EntityGroupContext,
  OwnershipInterestContext,
} from "@afenda/kernel";

import { deriveConsolidationScopeContext } from "./consolidation-scope-resolution.server.js";
import { loadOperatingContextOwnershipInterests } from "./load-operating-context-ownership-interests.server";

export interface ResolvedConsolidationScope {
  readonly consolidationScope: ConsolidationScopeContext | null;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
}

/**
 * Governed ERP boundary for consolidation scope (TIP-008A).
 * Loads ownership interests from database lookup services and derives scope metadata only.
 */
export async function resolveConsolidationScope(input: {
  readonly db?: AfendaDatabase;
  readonly entityGroup: EntityGroupContext | null;
  readonly reportingDate: string;
  readonly tenantId: string;
}): Promise<ResolvedConsolidationScope> {
  const ownershipInterests = await loadOperatingContextOwnershipInterests({
    tenantId: input.tenantId,
    entityGroupId: input.entityGroup?.entityGroupId ?? null,
    effectiveOn: input.reportingDate,
    ...(input.db === undefined ? {} : { db: input.db }),
  });

  const consolidationScope = input.entityGroup
    ? deriveConsolidationScopeContext({
        tenantId: input.tenantId,
        entityGroupId: input.entityGroup.entityGroupId,
        ownershipInterests,
        reportingDate: input.reportingDate,
      })
    : null;

  return { consolidationScope, ownershipInterests };
}
