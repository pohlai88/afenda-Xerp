/**
 * Grant scope domain barrel — glossary-aligned alias over `rls/` grant contracts.
 */
export {
  assertRlsTenantFilter,
  DEFAULT_RLS_GRANT_ELEVATION_FLAGS,
  type MembershipScopeMatchInput,
  membershipMatchesGrantScope,
  PERSISTED_MEMBERSHIP_SCOPE_TYPES,
  PLANNED_MEMBERSHIP_SCOPE_TYPES,
  type ResolvedRlsGrantScope,
  type ResolveRlsGrantScopeInput,
  RLS_GRANT_ELEVATION_KINDS,
  RLS_GRANT_SCOPE_TYPES,
  type RlsFilterContext,
  type RlsGrantElevationFlags,
  type RlsGrantElevationKind,
  type RlsGrantScopeType,
  RlsGrantScopeValidationError,
  resolveRlsGrantElevations,
  resolveRlsGrantScope,
  resolveRlsGrantScopeType,
  toRlsFilterContext,
} from "../rls/rls-grant.contract.js";
export {
  RLS_SESSION_KEYS,
  type RlsSessionContext,
} from "../rls/rls-session-context.contract.js";
export { withRlsSessionContext } from "../rls/with-rls-session-context.js";
