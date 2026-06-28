/**
 * TIP-007 — single import surface for platform entity authority contracts.
 * Re-exports canonical kernel shapes; does not duplicate interface definitions.
 */
// biome-ignore-all lint/performance/noBarrelFile: TIP-007 requires a governed platform authority export surface.

export type {
  LegalEntityContext,
  OrganizationUnitContext,
  PermissionScopeContext,
  TenantContext,
  WorkspaceContext,
} from "../../context/index.js";

export type {
  AuditEventId,
  CorrelationId,
  PermissionId,
  UserId,
} from "../../identity/index.js";

export {
  getPlatformEntityAuthority,
  isPlatformEntityId,
  PLATFORM_ENTITY_AUTHORITY_ENTRIES,
  PLATFORM_ENTITY_AUTHORITY_REGISTRY,
  PLATFORM_ENTITY_IDS,
  PLATFORM_ENTITY_POLICY,
  PLATFORM_ENTITY_RUNTIME_STATUSES,
  type PlatformEntityAuthorityEntry,
  type PlatformEntityId,
  type PlatformEntityRuntimeStatus,
  type RepoRelativePath,
} from "./platform-entity-authority.contract.js";
