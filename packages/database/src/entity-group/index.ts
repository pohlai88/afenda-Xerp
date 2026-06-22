export {
  assertEntityGroupSlug,
  buildEntityGroupInsertRow,
  buildEntityGroupUpdatePatch,
  InvalidEntityGroupSlugError,
  normalizeEntityGroupSlug,
  type EntityGroupInsertRow,
  type EntityGroupUpdatePatch,
  type EntityGroupWriteInput,
} from "./entity-group.contract.js";
export {
  EntityGroupScopeMismatchError,
  insertEntityGroup,
  updateEntityGroup,
  type EntityGroupAuditContext,
  type EntityGroupMutationResult,
  type InsertEntityGroupInput,
  type UpdateEntityGroupInput,
} from "./entity-group.service.js";
