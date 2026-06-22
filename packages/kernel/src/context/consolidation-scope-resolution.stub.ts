import type { ConsolidationScopeContext } from "./consolidation-scope-context.contract.js";
import type { OwnershipInterestContext } from "./ownership-interest-context.contract.js";
import { isOwnershipInterestEffectiveAt } from "./ownership-interest-context.contract.js";

export interface DeriveConsolidationScopeInput {
  readonly entityGroupId: string;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly reportingDate: string;
  readonly tenantId: string;
}

/**
 * Authority-only consolidation scope stub (TIP-008).
 * Assigns consolidation treatment per investee legal entity — no eliminations or arithmetic.
 * @see consolidation-scope-resolution.stub.ts — not production consolidation logic.
 */
export function deriveConsolidationScopeContext(
  input: DeriveConsolidationScopeInput
): ConsolidationScopeContext {
  const effectiveInterests = input.ownershipInterests.filter((interest) =>
    isOwnershipInterestEffectiveAt(interest, input.reportingDate)
  );

  const legalEntitiesByCompanyId = new Map<
    string,
    ConsolidationScopeContext["legalEntities"][number]
  >();

  for (const interest of effectiveInterests) {
    legalEntitiesByCompanyId.set(interest.childLegalEntityId, {
      companyId: interest.childLegalEntityId,
      consolidationTreatment: interest.consolidationTreatment,
      ownershipPercentage: interest.ownershipPercentage,
    });
  }

  return {
    tenantId: input.tenantId,
    entityGroupId: input.entityGroupId,
    reportingDate: input.reportingDate,
    legalEntities: [...legalEntitiesByCompanyId.values()],
  };
}
