import type { OwnershipInterestAuthorityRecord } from "@afenda/database";
import type { OwnershipInterestContext } from "@afenda/kernel";

export function toOwnershipInterestContext(
  record: OwnershipInterestAuthorityRecord
): OwnershipInterestContext {
  return {
    ownershipInterestId: record.ownershipInterestId,
    tenantId: record.tenantId,
    entityGroupId: record.entityGroupId,
    parentLegalEntityId: record.parentLegalEntityId,
    childLegalEntityId: record.investeeLegalEntityId,
    ownershipPercentage: record.ownershipPercentage,
    votingPercentage: record.votingPercentage,
    controlType: record.controlType,
    consolidationTreatment: record.consolidationTreatment,
    nonControllingInterestApplicable: record.nonControllingInterestApplicable,
    effectiveFrom: record.effectiveFrom,
    effectiveTo: record.effectiveTo,
    status: record.status,
  };
}
