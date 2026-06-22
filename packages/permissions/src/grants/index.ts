export {
  assertRegisteredPermissionKey,
  extractPermissionAction,
  extractPermissionDomain,
  isRegisteredPermissionKey,
  PERMISSION_REGISTRY,
  type PermissionAction,
  type PermissionTargetType,
  type RegisteredPermissionKey,
  resolveBoundaryPermissionKey,
} from "./permission.contract.js";
export {
  checkPermission,
  InMemoryPermissionDataSource,
  type PermissionCheckRequest,
  type PermissionDataSource,
  requirePermission,
} from "./permission-checker.js";
export {
  isRoleActive,
  type RoleContract,
  type RolePermissionAssignment,
  type RoleScope,
  type RoleStatus,
} from "./role.contract.js";
