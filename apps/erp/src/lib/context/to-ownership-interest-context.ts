import type {
  OwnershipInterestAuthorityRecord,
  OwnershipInterestLookupRow,
} from "@afenda/database";
import {
  type OwnershipInterestContext,
  parseUnknownOwnershipInterestContext,
} from "@afenda/kernel";

type OwnershipInterestSource =
  | OwnershipInterestAuthorityRecord
  | OwnershipInterestLookupRow;

function resolveOwnershipInterestId(record: OwnershipInterestSource): string {
  if ("ownershipInterestId" in record) {
    return record.ownershipInterestId;
  }

  if ("enterpriseId" in record) {
    return record.enterpriseId;
  }

  throw new Error(
    "ownershipInterestId is required for ownership interest mapping."
  );
}

function resolveTenantEnterpriseId(record: OwnershipInterestSource): string {
  return "tenantEnterpriseId" in record
    ? record.tenantEnterpriseId
    : record.tenantId;
}

function resolveEntityGroupEnterpriseId(
  record: OwnershipInterestSource
): string {
  return "entityGroupEnterpriseId" in record
    ? record.entityGroupEnterpriseId
    : record.entityGroupId;
}

function resolveParentLegalEntityEnterpriseId(
  record: OwnershipInterestSource
): string {
  return "parentLegalEntityEnterpriseId" in record
    ? record.parentLegalEntityEnterpriseId
    : record.parentLegalEntityId;
}

function resolveChildLegalEntityEnterpriseId(
  record: OwnershipInterestSource
): string {
  if ("childLegalEntityEnterpriseId" in record) {
    return record.childLegalEntityEnterpriseId;
  }

  if (record.childLegalEntityId) {
    return record.childLegalEntityId;
  }

  if ("investeeLegalEntityId" in record) {
    return record.investeeLegalEntityId;
  }

  throw new Error(
    "childLegalEntityId is required for ownership interest mapping."
  );
}

/** Maps database ownership interest authority rows to kernel `OwnershipInterestContext`. */
export function toOwnershipInterestContext(
  record: OwnershipInterestSource
): OwnershipInterestContext {
  const ownershipInterestId = resolveOwnershipInterestId(record);
  const tenantId = resolveTenantEnterpriseId(record);
  const entityGroupId = resolveEntityGroupEnterpriseId(record);
  const parentLegalEntityId = resolveParentLegalEntityEnterpriseId(record);
  const childLegalEntityId = resolveChildLegalEntityEnterpriseId(record);

  return parseUnknownOwnershipInterestContext({
    ownershipInterestId,
    tenantId,
    entityGroupId,
    parentLegalEntityId,
    childLegalEntityId,
    ownershipPercentage: record.ownershipPercentage,
    votingPercentage: record.votingPercentage,
    controlType: record.controlType,
    consolidationTreatment: record.consolidationTreatment,
    nonControllingInterestApplicable: record.nonControllingInterestApplicable,
    effectiveFrom: record.effectiveFrom,
    effectiveTo: record.effectiveTo,
    status: record.status,
  });
}
