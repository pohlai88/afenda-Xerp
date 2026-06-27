/**
 * Public export map for `@afenda/kernel` operating-context contracts.
 * Order follows multi-tenancy authority hierarchy (tenant → consolidation).
 */

// ── 10. Consolidation scope ──────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type ConsolidationScopeContext` export substring
export {
  type ConsolidationEntityScope,
  type ConsolidationScopeContext,
  type ConsolidationScopeWireContext,
} from "./consolidation-scope-context.contract.js";
// ── Registry (governance) ─────────────────────────────────────────────────────
export {
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES,
  type KernelOperatingContextPrimaryType,
  type KernelOperatingContextRequiredModule,
} from "./context-registry.js";
// ── Enterprise hierarchy metadata ─────────────────────────────────────────────
export {
  compareEnterpriseHierarchyTierOrder,
  ENTERPRISE_HIERARCHY_TIER_DEFINITIONS,
  ENTERPRISE_HIERARCHY_TIERS,
  type EnterpriseHierarchyPersistence,
  type EnterpriseHierarchyTier,
  type EnterpriseHierarchyTierDefinition,
  isEnterpriseHierarchyTier,
} from "./enterprise-hierarchy.contract.js";
// ── 2. Entity group ──────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type EntityGroupContext` export substring
export { type EntityGroupContext } from "./entity-group-context.contract.js";
// ── Hierarchy id boundary (TIP-008A Slice 6) ───────────────────────────────────
export {
  type assertHierarchyContextJsonSerializable,
  type BrandedOwnershipInterestContext,
  brandDeriveConsolidationScopeTrustInput,
  brandOwnershipInterestContext,
  type DeriveConsolidationScopeTrustInput,
  type DeriveConsolidationScopeWireInput,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  toOwnershipInterestWireContext,
} from "./hierarchy-id-boundary.contract.js";
// ── 3. Legal entity / company ────────────────────────────────────────────────
export {
  LEGAL_ENTITY_COMPANY_TYPES,
  type LegalEntityCompanyType,
  type LegalEntityContext,
} from "./legal-entity-context.contract.js";
// ── Shared lifecycle vocabulary ──────────────────────────────────────────────
export {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";
// ── Localization vocabulary (shape only) ───────────────────────────────────────
export {
  type assertLocalizationContextWireSerializable,
  type LocalizationContext,
  parseLocalizationContext,
  serializeLocalizationContext,
  type WireLocalizationContext,
} from "./localization-context.contract.js";
// ── 8. Operating context (composed) ────────────────────────────────────────────
export {
  OPERATING_CONTEXT_ERROR_CODES,
  type OperatingContext,
  type OperatingContextActor,
  type OperatingContextError,
  type OperatingContextErrorCode,
  type OperatingContextResult,
  type OperatingContextSelection,
} from "./operating-context.contract.js";
// ── Operating context hierarchy (PAS §4.4) ─────────────────────────────────────
export {
  compareOperatingContextLayerOrder,
  getOperatingContextLayer,
  isOperatingContextLayerId,
  OPERATING_CONTEXT_LAYER_IDS,
  OPERATING_CONTEXT_LAYERS,
  OPERATING_CONTEXT_OWNERSHIP_SPLIT,
  OPERATING_CONTEXT_POLICY,
  type OperatingContextFieldMap,
  type OperatingContextLayerDefinition,
  type OperatingContextLayerId,
  type OperatingContextLayerKind,
  type OperatingContextProhibitedKernelBehavior,
} from "./operating-context-hierarchy.contract.js";
// ── 5. Organization unit ─────────────────────────────────────────────────────
export {
  ORGANIZATION_UNIT_TYPES,
  type OrganizationUnitContext,
  type OrganizationUnitType,
} from "./organization-unit-context.contract.js";
// ── 4. Ownership interest ────────────────────────────────────────────────────
export {
  CONSOLIDATION_TREATMENTS,
  type ConsolidationTreatment,
  isOwnershipInterestEffectiveAt,
  OWNERSHIP_CONTROL_TYPES,
  type OwnershipControlType,
  type OwnershipInterestContext,
  type OwnershipInterestWireContext,
} from "./ownership-interest-context.contract.js";
// ── 9. Permission scope ──────────────────────────────────────────────────────
export {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isPermissionGrantScopeType,
  PERMISSION_GRANT_SCOPE_TYPES,
  type PermissionGrantElevationFlags,
  type PermissionGrantScopeType,
} from "./permission-grant-vocabulary.contract.js";
export type {
  assertPermissionScopeContextJsonSerializable,
  PermissionScopeContext,
  PermissionScopeWireContext,
} from "./permission-scope-context.contract.js";
// ── 7. Project ───────────────────────────────────────────────────────────────
export {
  PROJECT_LIFECYCLE_STATUSES,
  type ProjectContext,
  type ProjectLifecycleStatus,
} from "./project-context.contract.js";
export type {
  SurfaceContext,
  SurfaceId,
} from "./surface-context.contract.js";
// ── 6. Team ──────────────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type TeamContext` export substring
export { type TeamContext } from "./team-context.contract.js";
// ── 1. Tenant ────────────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type TenantContext` export substring
export { type TenantContext } from "./tenant-context.contract.js";
export type {
  WorkflowContext,
  WorkflowId,
} from "./workflow-context.contract.js";
// ── Derived runtime context (no authority) ─────────────────────────────────────
export type { WorkspaceContext } from "./workspace-context.contract.js";
