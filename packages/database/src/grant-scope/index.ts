/**
 * Grant scope domain barrel — glossary-aligned alias over `rls/` grant contracts.
 */
export {
  DEFAULT_RLS_GRANT_ELEVATION_FLAGS,
  membershipMatchesGrantScope,
  PLANNED_MEMBERSHIP_SCOPE_TYPES,
  PERSISTED_MEMBERSHIP_SCOPE_TYPES,
  resolveRlsGrantScope,
  resolveRlsGrantScopeType,
  resolveRlsGrantElevations,
  RLS_GRANT_ELEVATION_KINDS,
  RLS_GRANT_SCOPE_TYPES,
  RlsGrantScopeValidationError,
  assertRlsTenantFilter,
  toRlsFilterContext,
  type MembershipScopeMatchInput,
  type ResolvedRlsGrantScope,
  type ResolveRlsGrantScopeInput,
  type RlsFilterContext,
  type RlsGrantElevationFlags,
  type RlsGrantElevationKind,
  type RlsGrantScopeType,
} from "../rls/rls-grant.contract.js";
export {
  RLS_SESSION_KEYS,
  type RlsSessionContext,
} from "../rls/rls-session-context.contract.js";
export { withRlsSessionContext } from "../rls/with-rls-session-context.js";
