/**
 * Public export map for `@afenda/kernel` operating-context contracts.
 * Order follows multi-tenancy authority hierarchy (tenant → consolidation).
 */

// ── Accounting-readiness authority stub (no arithmetic) ───────────────────────
export {
  type AccountingReadinessContext,
  isCostCenterOrganizationUnit,
  resolveReportingCurrency,
  toAccountingReadinessContext,
} from "./accounting-readiness.contract.js";
// ── AppShell display contracts (no authority) ────────────────────────────────
export {
  type ApplicationShellAllowedContextOptions,
  type ApplicationShellContextSwitchTarget,
  formatWorkspaceDisplayLabel,
  type WorkspaceDisplayLabelInput,
} from "./app-shell-context.contract.js";
// ── 10. Consolidation scope ──────────────────────────────────────────────────
export {
  type ConsolidationEntityScope,
  type ConsolidationScopeContext,
} from "./consolidation-scope-context.contract.js";
// ── Consolidation scope derivation stub (TIP-008) ─────────────────────────────
export {
  type DeriveConsolidationScopeInput,
  deriveConsolidationScopeContext,
} from "./consolidation-scope-resolution.stub.js";
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
export { type EntityGroupContext } from "./entity-group-context.contract.js";
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
export { type TeamContext } from "./team-context.contract.js";
// ── 1. Tenant ────────────────────────────────────────────────────────────────
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
