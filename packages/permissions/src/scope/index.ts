export {
  type ResolvePermissionScopeInput,
  resolvePermissionScopeContext,
  selectNarrowestMatchingMembership,
} from "./grant-scope-resolution.js";
export {
  isMembershipActive,
  type MembershipContract,
  type MembershipScopeType,
  type MembershipStatus,
  membershipMatchesGrantScope,
} from "./membership.contract.js";
export {
  isDeniedScopedMembershipResolution,
  isMatchedScopedMembershipResolution,
  resolveScopedMembership,
  type ScopedMembershipResolution,
} from "./membership-resolution.js";
export type {
  assertPermissionScopeContextJsonSerializable,
  PermissionScopeContext,
  PermissionScopeWireContext,
} from "./permission-scope-context.contract.js";
export type { RoleScope } from "./role-scope.contract.js";
