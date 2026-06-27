import type { ConsolidationScopeContext } from "./consolidation-scope-context.contract.js";
import { mergeInvesteeConsolidationScopeEntry } from "./consolidation-scope-investee-merge.policy.js";
import {
  type DeriveConsolidationScopeWireInput,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
} from "./hierarchy-id-boundary.contract.js";
import { isOwnershipInterestEffectiveAt } from "./ownership-interest-context.contract.js";

export type DeriveConsolidationScopeInput = DeriveConsolidationScopeWireInput;

/**
 * Governed non-accounting consolidation scope resolver (TIP-008A).
 * Assigns consolidation treatment per investee legal entity — no eliminations or arithmetic.
 *
 * Duplicate investees: see `CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY` in
 * `consolidation-scope-investee-merge.policy.ts`.
 */
export function deriveConsolidationScopeContext(
  input: DeriveConsolidationScopeInput
): ConsolidationScopeContext {
  const tenantId = normalizeTenantIdForWire(input.tenantId);
  const entityGroupId = normalizeEntityGroupIdForWire(input.entityGroupId);

  const effectiveInterests = input.ownershipInterests.filter((interest) =>
    isOwnershipInterestEffectiveAt(interest, input.reportingDate)
  );

  const legalEntitiesByCompanyId = new Map<
    string,
    ConsolidationScopeContext["legalEntities"][number]
  >();

  for (const interest of effectiveInterests) {
    const incoming = {
      companyId: interest.childLegalEntityId,
      consolidationTreatment: interest.consolidationTreatment,
      ownershipPercentage: interest.ownershipPercentage,
    } satisfies ConsolidationScopeContext["legalEntities"][number];

    legalEntitiesByCompanyId.set(
      interest.childLegalEntityId,
      mergeInvesteeConsolidationScopeEntry(
        legalEntitiesByCompanyId.get(interest.childLegalEntityId),
        incoming
      )
    );
  }

  return {
    tenantId,
    entityGroupId,
    reportingDate: input.reportingDate,
    legalEntities: [...legalEntitiesByCompanyId.values()],
  };
}
