import { normalizeCompanyIdForWire } from "@afenda/kernel";
import {
  type ConsolidationScopeContext,
  type ConsolidationScopeWireContext,
  type DeriveConsolidationScopeWireInput,
  isOwnershipInterestEffectiveAt,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  parseConsolidationScopeContext,
} from "@afenda/kernel/context";

import { mergeInvesteeConsolidationScopeEntry } from "./consolidation-scope-investee-merge.policy.js";

export type DeriveConsolidationScopeInput = DeriveConsolidationScopeWireInput;

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

/**
 * Governed non-accounting consolidation scope derivation (Foundation phase 08).
 * Assigns consolidation treatment per investee legal entity — no eliminations or arithmetic.
 *
 * Owner: apps/erp (PAS-001 §4.4 — operating context resolver).
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
    const incoming = {
      companyId: interest.childLegalEntityId,
      consolidationTreatment: interest.consolidationTreatment,
      ownershipPercentage: interest.ownershipPercentage,
    } satisfies ConsolidationScopeContext["legalEntities"][number];

    const companyKey = requiredWireString(
      normalizeCompanyIdForWire(interest.childLegalEntityId),
      "companyId"
    );

    legalEntitiesByCompanyId.set(
      companyKey,
      mergeInvesteeConsolidationScopeEntry(
        legalEntitiesByCompanyId.get(companyKey),
        incoming
      )
    );
  }

  const wire: ConsolidationScopeWireContext = {
    tenantId: normalizeTenantIdForWire(input.tenantId),
    entityGroupId: normalizeEntityGroupIdForWire(input.entityGroupId),
    reportingDate: input.reportingDate,
    legalEntities: [...legalEntitiesByCompanyId.values()].map((entry) => ({
      companyId: requiredWireString(
        normalizeCompanyIdForWire(entry.companyId),
        "companyId"
      ),
      consolidationTreatment: entry.consolidationTreatment,
      ownershipPercentage: entry.ownershipPercentage,
    })),
  };

  return parseConsolidationScopeContext(wire);
}
