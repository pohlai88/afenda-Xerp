/** @afenda/permissions — authorization foundation (Foundation phase 05). */
export const PACKAGE_NAME = "@afenda/permissions" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  assertPermissionKey,
  createPermissionKey,
  InvalidPermissionKeyError,
  isPermissionKey,
  type PermissionKey,
} from "@afenda/database";
export {
  type AuthorizationActor,
  type AuthorizationContext,
  type AuthorizationContextInput,
  actorFromAuthSession,
  assertAuthorizationActor,
  assertTenantContext,
  createAuthorizationCorrelationId,
  isMissingAuthorizationActorError,
  isMissingAuthorizationContextError,
  MissingAuthorizationActorError,
  MissingAuthorizationContextError,
  type ResolvedAuthorizationContext,
  resolveAuthorizationContext,
} from "./authorization-context.js";
export type { AuthorizationDenialCode } from "./authorization-denial-code.js";
export {
  type AllowedAuthorizationResult,
  type AuthorizationDecision,
  AuthorizationDeniedError,
  type AuthorizationResult,
  buildAuthorizationDecision,
  createAllowedAuthorizationResult,
  createDeniedAuthorizationResult,
  type DeniedAuthorizationResult,
  isAuthorizationDeniedError,
  isDeniedAuthorizationResult,
  isPolicyGateError,
  PolicyGateError,
} from "./authorization-error.js";
export {
  createProductionAuthorizationDataSources,
  type ProductionAuthorizationDataSources,
} from "./database/create-production-data-sources.js";
export {
  createProductionPermissionDataSource,
  DatabasePermissionDataSource,
} from "./database/database-permission-data-source.js";
export {
  createProductionPolicyDataSource,
  DatabasePolicyDataSource,
} from "./database/database-policy-data-source.js";
export {
  assertRegisteredPermissionKey,
  checkPermission,
  extractPermissionAction,
  extractPermissionDomain,
  InMemoryPermissionDataSource,
  isRegisteredPermissionKey,
  isRoleActive,
  PERMISSION_REGISTRY,
  type PermissionAction,
  type PermissionCheckRequest,
  type PermissionDataSource,
  type PermissionTargetType,
  type RegisteredPermissionKey,
  type RoleContract,
  type RolePermissionAssignment,
  type RoleScope,
  type RoleStatus,
  requirePermission,
  resolveBoundaryPermissionKey,
} from "./grants/index.js";
export {
  PERMISSIONS_BARREL_DEPENDENCY_RULE,
  PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES,
  PERMISSIONS_LEGACY_FLAT_MODULES,
  PERMISSIONS_PLANNED_MEMBERSHIP_SCOPES,
  PERMISSIONS_SCOPE_GRANTS_BARREL_DIRECTORIES,
  PERMISSIONS_SCOPE_GRANTS_MODULES,
  type PermissionsImplementedMembershipScope,
  type PermissionsScopeGrantsModule,
} from "./permissions-scope-grants-registry.js";
export {
  isExecutablePolicyDecision,
  isPolicyActive,
  isPolicyGateDecision,
  POLICY_GATE_DECISIONS,
  type PolicyContract,
  type PolicyDecision,
  type PolicyEvaluationInput,
  type PolicyEvaluationResult,
  type PolicyGateDecision,
  type PolicyStatus,
  policyRuleMatches,
  type RegisteredPolicyRule,
  resolvePolicyWhenMatched,
  sortPoliciesByPriority,
} from "./policy.contract.js";
export {
  databasePolicyAuditWriter,
  noopPolicyAuditWriter,
  type PolicyEvaluationAuditInput,
  type PolicyEvaluationAuditWriter,
} from "./policy-audit.js";
export {
  checkPolicyDecision,
  evaluateAuthorizationPolicy,
  evaluatePolicyDecision,
  InMemoryPolicyDataSource,
  type PolicyDataSource,
  type PolicyDecisionRequest,
  type PolicyEvaluationOptions,
  productionPolicyEvaluationOptions,
  requirePolicyDecision,
} from "./policy-engine.js";
export {
  type assertPermissionScopeContextJsonSerializable,
  isDeniedScopedMembershipResolution,
  isMatchedScopedMembershipResolution,
  isMembershipActive,
  type MembershipContract,
  type MembershipScopeType,
  type MembershipStatus,
  membershipMatchesGrantScope,
  type PermissionScopeContext,
  type PermissionScopeWireContext,
  type ResolvePermissionScopeInput,
  resolvePermissionScopeContext,
  resolveScopedMembership,
  type ScopedMembershipResolution,
  selectNarrowestMatchingMembership,
} from "./scope/index.js";
export {
  getTenantAccessBlockReason,
  isTenantOperational,
  type PlatformTenantStatus,
  type TenantContract,
} from "./tenant.contract.js";
export {
  isPlatformUserActive,
  type PlatformUserContract,
  type PlatformUserStatus,
} from "./user.contract.js";
