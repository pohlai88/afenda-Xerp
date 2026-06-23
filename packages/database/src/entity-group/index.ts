export {
  assertEntityGroupSlug,
  buildEntityGroupInsertRow,
  buildEntityGroupUpdatePatch,
  type EntityGroupInsertRow,
  type EntityGroupUpdatePatch,
  type EntityGroupWriteInput,
  InvalidEntityGroupSlugError,
  normalizeEntityGroupSlug,
} from "./entity-group.contract.js";
export {
  type EntityGroupAuditContext,
  type EntityGroupMutationResult,
  EntityGroupScopeMismatchError,
  type InsertEntityGroupInput,
  insertEntityGroup,
  type UpdateEntityGroupInput,
  updateEntityGroup,
} from "./entity-group.service.js";
