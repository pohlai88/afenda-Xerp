export {
  CONSOLIDATION_TREATMENTS,
  type ConsolidationTreatment,
  consolidationMethodToTreatment,
  consolidationTreatmentToMethod,
  isConsolidationTreatment,
} from "./ownership-interest.consolidation-treatment.js";
export {
  assertDistinctLegalEntities,
  buildOwnershipInterestInsertRow,
  type OwnershipInterestAuthorityRecord,
  OwnershipInterestCycleError,
  type OwnershipInterestInsertRow,
  OwnershipInterestValidationError,
  type OwnershipInterestWriteInput,
  resolveInvesteeLegalEntityId,
  resolveNonControllingInterestApplicable,
  toOwnershipInterestAuthorityRecord,
} from "./ownership-interest.contract.js";
export {
  type InsertOwnershipInterestInput,
  insertOwnershipInterest,
  type OwnershipInterestAuditContext,
  type OwnershipInterestMutationResult,
  OwnershipInterestScopeMismatchError,
} from "./ownership-interest.service.js";
export {
  type FindOwnershipInterestsInput,
  findOwnershipInterestsByEntityGroup,
} from "./ownership-interest-lookup.service.js";
