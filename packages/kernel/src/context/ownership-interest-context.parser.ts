import {
  normalizeOwnershipInterestIdForWire,
  parseOwnershipInterestId,
} from "../identity/families/enterprise-hierarchy-id.contract.js";
import {
  normalizeCompanyIdForWire,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  parseCompanyId,
  parseEntityGroupId,
  parseTenantId,
} from "../identity/families/tenant-hierarchy-id.contract.js";
import {
  assertWireOwnershipInterestContext,
  brandPercentageNumber,
} from "./ownership-interest-context.assert.js";
import type {
  OwnershipInterestContext,
  OwnershipInterestWireContext,
} from "./ownership-interest-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseValidatedOwnershipInterestContext(
  value: OwnershipInterestWireContext
): OwnershipInterestContext {
  return {
    tenantId: parseTenantId(value.tenantId),
    entityGroupId: parseEntityGroupId(value.entityGroupId),
    ownershipInterestId: parseOwnershipInterestId(value.ownershipInterestId),
    parentLegalEntityId: parseCompanyId(value.parentLegalEntityId),
    childLegalEntityId: parseCompanyId(value.childLegalEntityId),
    ownershipPercentage: brandPercentageNumber(
      value.ownershipPercentage,
      "ownershipPercentage"
    ),
    votingPercentage: brandPercentageNumber(
      value.votingPercentage,
      "votingPercentage"
    ),
    controlType: value.controlType,
    consolidationTreatment: value.consolidationTreatment,
    nonControllingInterestApplicable: value.nonControllingInterestApplicable,
    effectiveFrom: value.effectiveFrom,
    effectiveTo: value.effectiveTo,
    status: value.status,
  };
}

export function parseOwnershipInterestContext(
  value: OwnershipInterestWireContext
): OwnershipInterestContext {
  assertWireOwnershipInterestContext(value);
  return parseValidatedOwnershipInterestContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs. */
export function parseUnknownOwnershipInterestContext(
  value: unknown
): OwnershipInterestContext {
  assertWireOwnershipInterestContext(value);
  return parseValidatedOwnershipInterestContext(value);
}

export function normalizeOwnershipInterestContextForWire(
  value: OwnershipInterestContext
): OwnershipInterestWireContext {
  return {
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    entityGroupId: requiredWireString(
      normalizeEntityGroupIdForWire(value.entityGroupId),
      "entityGroupId"
    ),
    ownershipInterestId: requiredWireString(
      normalizeOwnershipInterestIdForWire(value.ownershipInterestId),
      "ownershipInterestId"
    ),
    parentLegalEntityId: requiredWireString(
      normalizeCompanyIdForWire(value.parentLegalEntityId),
      "parentLegalEntityId"
    ),
    childLegalEntityId: requiredWireString(
      normalizeCompanyIdForWire(value.childLegalEntityId),
      "childLegalEntityId"
    ),

    ownershipPercentage: value.ownershipPercentage,
    votingPercentage: value.votingPercentage,
    controlType: value.controlType,
    consolidationTreatment: value.consolidationTreatment,
    nonControllingInterestApplicable: value.nonControllingInterestApplicable,
    effectiveFrom: value.effectiveFrom,
    effectiveTo: value.effectiveTo,
    status: value.status,
  };
}

/** Wire egress alias — same contract as `normalizeOwnershipInterestContextForWire`. */
export function serializeOwnershipInterestContext(
  value: OwnershipInterestContext
): OwnershipInterestWireContext {
  return normalizeOwnershipInterestContextForWire(value);
}
