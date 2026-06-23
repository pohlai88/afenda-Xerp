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
  type OrganizationInsertRow,
  type OrganizationInsertRow as OrganizationUnitInsertRow,
  OrganizationParentNotFoundError,
  OrganizationScopeMismatchError,
  type OrganizationUnitAuthorityRecord,
  type OrganizationUpdatePatch,
  type OrganizationUpdatePatch as OrganizationUnitUpdatePatch,
  OrganizationValidationError,
  type OrganizationWriteInput,
  type OrganizationWriteInput as OrganizationUnitWriteInput,
  resolveLegalEntityId,
  resolveOrganizationUnitType,
  resolveParentOrganizationUnitId,
  toOrganizationUnitAuthorityRecord,
} from "../organization/organization.contract.js";
export {
  type DeleteOrganizationInput,
  type DeleteOrganizationInput as DeleteOrganizationUnitInput,
  deleteOrganization,
  type InsertOrganizationInput,
  type InsertOrganizationInput as InsertOrganizationUnitInput,
  insertOrganization,
  type OrganizationAuditContext,
  type OrganizationAuditContext as OrganizationUnitAuditContext,
  type OrganizationMutationResult,
  type OrganizationMutationResult as OrganizationUnitMutationResult,
  type UpdateOrganizationInput,
  type UpdateOrganizationInput as UpdateOrganizationUnitInput,
  updateOrganization,
} from "../organization/organization.service.js";
export type { OrganizationLookupRow as OrganizationUnitLookupRow } from "../workspace/workspace-lookup.service.js";
