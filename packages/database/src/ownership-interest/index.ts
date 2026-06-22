export {
  assertDistinctLegalEntities,
  buildOwnershipInterestInsertRow,
  OwnershipInterestCycleError,
  OwnershipInterestValidationError,
  resolveInvesteeLegalEntityId,
  resolveNonControllingInterestApplicable,
  toOwnershipInterestAuthorityRecord,
  type OwnershipInterestAuthorityRecord,
  type OwnershipInterestInsertRow,
  type OwnershipInterestWriteInput,
} from "./ownership-interest.contract.js";
export {
  CONSOLIDATION_TREATMENTS,
  consolidationMethodToTreatment,
  consolidationTreatmentToMethod,
  isConsolidationTreatment,
  type ConsolidationTreatment,
} from "./ownership-interest.consolidation-treatment.js";
export {
  findOwnershipInterestsByEntityGroup,
  type FindOwnershipInterestsInput,
} from "./ownership-interest-lookup.service.js";
export {
  insertOwnershipInterest,
  OwnershipInterestScopeMismatchError,
  type InsertOwnershipInterestInput,
  type OwnershipInterestAuditContext,
  type OwnershipInterestMutationResult,
} from "./ownership-interest.service.js";
