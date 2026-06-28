import {
  normalizeCompanyIdForWire,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  parseCompanyId,
  parseEntityGroupId,
  parseTenantId,
} from "../identity/index.js";
import { assertWireConsolidationScopeContext } from "./consolidation-scope-context.assert.js";
import type {
  ConsolidationEntityScope,
  ConsolidationEntityScopeWire,
  ConsolidationScopeContext,
  ConsolidationScopeWireContext,
} from "./consolidation-scope-context.contract.js";
import { brandPercentageNumber } from "./ownership-interest-context.assert.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseConsolidationEntityScope(
  value: ConsolidationEntityScopeWire
): ConsolidationEntityScope {
  return {
    companyId: parseCompanyId(value.companyId),
    consolidationTreatment: value.consolidationTreatment,
    ownershipPercentage: brandPercentageNumber(
      value.ownershipPercentage,
      "ownershipPercentage"
    ),
  };
}

function parseValidatedConsolidationScopeContext(
  value: ConsolidationScopeWireContext
): ConsolidationScopeContext {
  return {
    tenantId: parseTenantId(value.tenantId),
    entityGroupId: parseEntityGroupId(value.entityGroupId),
    reportingDate: value.reportingDate,
    legalEntities: value.legalEntities.map((entry) =>
      parseConsolidationEntityScope(entry)
    ),
  };
}

export function parseConsolidationScopeContext(
  value: ConsolidationScopeWireContext
): ConsolidationScopeContext {
  assertWireConsolidationScopeContext(value);
  return parseValidatedConsolidationScopeContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs. */
export function parseUnknownConsolidationScopeContext(
  value: unknown
): ConsolidationScopeContext {
  assertWireConsolidationScopeContext(value);
  return parseValidatedConsolidationScopeContext(value);
}

/** Wire egress — JSON/API serialization after branded context is trusted. */
export function normalizeConsolidationScopeContextForWire(
  value: ConsolidationScopeContext
): ConsolidationScopeWireContext {
  return {
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    entityGroupId: requiredWireString(
      normalizeEntityGroupIdForWire(value.entityGroupId),
      "entityGroupId"
    ),
    reportingDate: value.reportingDate,
    legalEntities: value.legalEntities.map((entry) => ({
      companyId: requiredWireString(
        normalizeCompanyIdForWire(entry.companyId),
        "companyId"
      ),
      consolidationTreatment: entry.consolidationTreatment,
      ownershipPercentage: entry.ownershipPercentage,
    })),
  };
}

/** Wire egress alias — same contract as `normalizeConsolidationScopeContextForWire`. */
export function serializeConsolidationScopeContext(
  value: ConsolidationScopeContext
): ConsolidationScopeWireContext {
  return normalizeConsolidationScopeContextForWire(value);
}
