import type { OwnershipInterestLookupRow } from "@afenda/database";
import {
  type OwnershipInterestContext,
  parseUnknownOwnershipInterestContext,
} from "@afenda/kernel";

export function toOwnershipInterestContext(
  record: OwnershipInterestLookupRow
): OwnershipInterestContext {
  return parseUnknownOwnershipInterestContext({
    ownershipInterestId: record.enterpriseId,
    tenantId: record.tenantEnterpriseId,
    entityGroupId: record.entityGroupEnterpriseId,
    parentLegalEntityId: record.parentLegalEntityEnterpriseId,
    childLegalEntityId: record.childLegalEntityEnterpriseId,
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
