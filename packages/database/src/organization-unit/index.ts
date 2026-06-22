/**
 * Organization Unit domain barrel — glossary-aligned alias over `organization/`.
 * Do not treat organization units as legal entities.
 */
export {
  assertNoOrganizationCycle,
  assertOrganizationSlug,
  buildOrganizationInsertRow,
  buildOrganizationUpdatePatch,
  InvalidOrganizationSlugError,
  normalizeOrganizationSlug,
  OrganizationCycleError,
  OrganizationHasChildrenError,
  OrganizationParentNotFoundError,
  OrganizationScopeMismatchError,
  OrganizationValidationError,
  resolveLegalEntityId,
  resolveOrganizationUnitType,
  resolveParentOrganizationUnitId,
  toOrganizationUnitAuthorityRecord,
  type OrganizationInsertRow,
  type OrganizationInsertRow as OrganizationUnitInsertRow,
  type OrganizationUnitAuthorityRecord,
  type OrganizationUpdatePatch,
  type OrganizationUpdatePatch as OrganizationUnitUpdatePatch,
  type OrganizationWriteInput,
  type OrganizationWriteInput as OrganizationUnitWriteInput,
} from "../organization/organization.contract.js";
export {
  deleteOrganization,
  insertOrganization,
  updateOrganization,
  type DeleteOrganizationInput,
  type DeleteOrganizationInput as DeleteOrganizationUnitInput,
  type InsertOrganizationInput,
  type InsertOrganizationInput as InsertOrganizationUnitInput,
  type OrganizationAuditContext,
  type OrganizationAuditContext as OrganizationUnitAuditContext,
  type OrganizationMutationResult,
  type OrganizationMutationResult as OrganizationUnitMutationResult,
  type UpdateOrganizationInput,
  type UpdateOrganizationInput as UpdateOrganizationUnitInput,
} from "../organization/organization.service.js";
export type { OrganizationLookupRow as OrganizationUnitLookupRow } from "../workspace/workspace-lookup.service.js";
