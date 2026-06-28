export type { PermissionAction } from "./permission-action.contract.js";
export {
  isPermissionAction,
  PERMISSION_ACTIONS,
} from "./permission-action.contract.js";
export {
  assertPermissionModelDescriptor,
  type assertPermissionModelDescriptorJsonSerializable,
  assertWirePermissionModelDescriptor,
} from "./permission-model.assert.js";
export type {
  PermissionModelDescriptor,
  PermissionModelWireDescriptor,
} from "./permission-model.contract.js";
export {
  composeModuleActionWireKey,
  isPermissionModelDescriptor,
  PERMISSION_MODEL_PATTERN,
} from "./permission-model.contract.js";
export {
  normalizePermissionModelDescriptorForWire,
  parseUnknownPermissionModelDescriptor,
  serializePermissionModelDescriptor,
} from "./permission-model.parser.js";
export type { PermissionModelScope } from "./permission-model-scope.contract.js";
export {
  isPermissionModelScope,
  PERMISSION_MODEL_SCOPE_GRANT_ALIASES,
  PERMISSION_MODEL_SCOPES,
} from "./permission-model-scope.contract.js";
export {
  getPermissionAction,
  getPermissionModelScope,
  PERMISSION_VOCABULARY_AUTHORITY,
  PERMISSION_VOCABULARY_OWNERSHIP,
} from "./permission-vocabulary.contract.js";
