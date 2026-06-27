import {
  type ConsolidationScopeContext,
  type DeriveConsolidationScopeWireInput,
  isOwnershipInterestEffectiveAt,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
} from "@afenda/kernel/context";

import { mergeInvesteeConsolidationScopeEntry } from "./consolidation-scope-investee-merge.policy.js";

export type DeriveConsolidationScopeInput = DeriveConsolidationScopeWireInput;

/**
 * Governed non-accounting consolidation scope derivation (TIP-008A).
 * Assigns consolidation treatment per investee legal entity — no eliminations or arithmetic.
 *
 * Owner: apps/erp (PAS-001 §4.4 — operating context resolver).
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
