/**
 * Public export map for `@afenda/kernel` operating-context contracts.
 * Order follows multi-tenancy authority hierarchy (tenant → consolidation).
 */

// ── Accounting-readiness authority stub (no arithmetic) ───────────────────────
export {
  type AccountingReadinessContext,
  type AccountingReadinessWireContext,
  type assertAccountingReadinessContextJsonSerializable,
  isCostCenterOrganizationUnit,
  resolveReportingCurrency,
  toAccountingReadinessContext,
} from "./accounting-readiness.contract.js";
export type {
  AccountingReadinessDelegatedGateRunKind,
  AccountingReadinessDelegatedGateRunResult,
  AccountingReadinessGateLiveRunMode,
  AccountingReadinessGateLiveSnapshot,
  AccountingReadinessRequirementLiveKind,
  AccountingReadinessRequirementLiveStatus,
  assertAccountingReadinessGateLiveSnapshotJsonSerializable,
} from "./accounting-readiness-gate-live-status.contract.js";
export type { AccountingReadinessGateRequirementId } from "./accounting-readiness-gate-requirement-id.contract.js";
// ── AppShell display contracts (no authority) ────────────────────────────────
export {
  type ApplicationShellAllowedContextOptions,
  type ApplicationShellContextSwitchTarget,
  formatWorkspaceDisplayLabel,
  type WorkspaceDisplayLabelInput,
} from "./app-shell-context.contract.js";
// ── 10. Consolidation scope ──────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type ConsolidationScopeContext` export substring
export {
  type ConsolidationEntityScope,
  type ConsolidationScopeContext,
  type ConsolidationScopeWireContext,
} from "./consolidation-scope-context.contract.js";
// ── Consolidation scope resolver (TIP-008A — scope metadata only) ───────────────
export {
  CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY,
  type ConsolidationScopeInvesteeDedupPolicy,
  mergeInvesteeConsolidationScopeEntry,
} from "./consolidation-scope-investee-merge.policy.js";
export {
  type DeriveConsolidationScopeInput,
  deriveConsolidationScopeContext,
} from "./consolidation-scope-resolution.server.js";
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
  PERMISSION_GRANT_SCOPE_TYPES,
  type PermissionGrantElevationFlags,
  type PermissionGrantScopeType,
  type PermissionScopeContext,
} from "./permission-scope-context.contract.js";
// ── 7. Project ───────────────────────────────────────────────────────────────
export {
  PROJECT_LIFECYCLE_STATUSES,
  type ProjectContext,
  type ProjectLifecycleStatus,
} from "./project-context.contract.js";
export { normalizeRuntimeModulePath } from "./runtime-module-path.js";
export {
  parseSurfaceId,
  type SurfaceContext,
  type SurfaceId,
  toSurfaceContext,
} from "./surface-context.contract.js";
// ── 6. Team ──────────────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type TeamContext` export substring
export { type TeamContext } from "./team-context.contract.js";
// ── 1. Tenant ────────────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type TenantContext` export substring
export { type TenantContext } from "./tenant-context.contract.js";
// ── Client authority guard ─────────────────────────────────────────────────────
export {
  findUntrustedClientAuthorityFields,
  isUntrustedClientAuthorityFieldKey,
  UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS,
  type UntrustedClientAuthorityFieldKey,
} from "./untrusted-client-authority.contract.js";
export {
  parseWorkflowId,
  toWorkflowContext,
  type WorkflowContext,
  type WorkflowId,
} from "./workflow-context.contract.js";
// ── Derived runtime context (no authority) ─────────────────────────────────────
export type { WorkspaceContext } from "./workspace-context.contract.js";
