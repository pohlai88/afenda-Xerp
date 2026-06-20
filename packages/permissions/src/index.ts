/** @afenda/permissions — authorization foundation (TIP-005). */
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
  isMembershipActive,
  type MembershipContract,
  type MembershipScopeType,
  type MembershipStatus,
  membershipMatchesCompany,
  membershipMatchesOrganization,
} from "./membership.contract.js";
export {
  isDeniedScopedMembershipResolution,
  isMatchedScopedMembershipResolution,
  resolveScopedMembership,
  type ScopedMembershipResolution,
} from "./membership-resolution.js";
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
  isRoleActive,
  type RoleContract,
  type RolePermissionAssignment,
  type RoleScope,
  type RoleStatus,
} from "./role.contract.js";
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
