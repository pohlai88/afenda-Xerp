/**
 * Public export map for `@afenda/kernel` operating-context contracts.
 * Order follows multi-tenancy authority hierarchy (tenant → consolidation).
 */

export {
  type assertConsolidationScopeContextWireSerializable,
  assertWireConsolidationScopeContext,
} from "./consolidation-scope-context.assert.js";
// ── 10. Consolidation scope ──────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type ConsolidationScopeContext` export substring
export {
  type ConsolidationEntityScope,
  type ConsolidationEntityScopeWire,
  type ConsolidationScopeContext,
  type ConsolidationScopeWireContext,
} from "./consolidation-scope-context.contract.js";
export {
  normalizeConsolidationScopeContextForWire,
  parseConsolidationScopeContext,
  parseUnknownConsolidationScopeContext,
  serializeConsolidationScopeContext,
} from "./consolidation-scope-context.parser.js";
// ── Registry (governance) ─────────────────────────────────────────────────────
export {
  KERNEL_OPERATING_CONTEXT_PRIMARY_TYPES,
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES,
  KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES,
  type KernelOperatingContextPrimaryType,
  type KernelOperatingContextRequiredModule,
  type KernelOperatingContextWireIngressModule,
  type KernelOperatingContextWireIngressSlug,
  listKernelOperatingContextModuleFiles,
  listKernelOperatingContextWireIngressFiles,
} from "./context-registry.js";
export {
  assertDecimalPrecisionScale,
  assertWireDecimalPrecisionVocabulary,
} from "./decimal-precision.assert.js";
// ── Decimal precision vocabulary (B112 · ADR-0029) ───────────────────────────
export type {
  DecimalPrecision,
  DecimalPrecisionVocabulary,
  WireDecimalPrecisionVocabulary,
} from "./decimal-precision.contract.js";
export {
  DECIMAL_PRECISION_MAX,
  DECIMAL_PRECISION_MIN,
  isDecimalPrecisionScale,
} from "./decimal-precision.contract.js";
export {
  parseDecimalPrecisionVocabulary,
  parseUnknownDecimalPrecisionVocabulary,
  serializeDecimalPrecisionVocabulary,
} from "./decimal-precision.parser.js";
export {
  isNullableEffectiveRangeAt,
  isRecordEffectiveAt,
} from "./effective-dating-vocabulary.contract.js";
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
export {
  assertEntityGroupContextOptionalText,
  assertEntityGroupContextSlug,
  assertEntityGroupContextText,
  type assertEntityGroupContextWireSerializable,
  assertWireEntityGroupContext,
} from "./entity-group-context.assert.js";
// ── 2. Entity group ──────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type EntityGroupContext` export substring
export {
  type EntityGroupContext,
  type EntityGroupWireContext,
} from "./entity-group-context.contract.js";
export {
  normalizeEntityGroupContextForWire,
  parseEntityGroupContext,
  parseUnknownEntityGroupContext,
  serializeEntityGroupContext,
} from "./entity-group-context.parser.js";
// ── Hierarchy id boundary (Foundation phase 08 Slice 6 / B68 wire triad) ─────────────────
export type { assertHierarchyContextJsonSerializable } from "./hierarchy-id-boundary.assert.js";
export type {
  DeriveConsolidationScopeTrustInput,
  DeriveConsolidationScopeWireInput,
} from "./hierarchy-id-boundary.contract.js";
export {
  brandDeriveConsolidationScopeTrustInput,
  brandOwnershipInterestContext,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  toOwnershipInterestWireContext,
} from "./hierarchy-id-boundary.parser.js";
export {
  assertLegalEntityCompanyRelationship,
  type assertLegalEntityContextWireSerializable,
  assertWireLegalEntityContext,
  isLegalEntityCompanyType,
  isRelationshipToHoldingCompanyType,
} from "./legal-entity-context.assert.js";
// ── 3. Legal entity / company ────────────────────────────────────────────────
export {
  LEGAL_ENTITY_COMPANY_TYPES,
  type LegalEntityCompanyType,
  type LegalEntityContext,
  type LegalEntityWireContext,
  RELATIONSHIP_TO_HOLDING_COMPANY_TYPES,
  type RelationshipToHoldingCompanyType,
} from "./legal-entity-context.contract.js";
export {
  normalizeLegalEntityContextForWire,
  parseLegalEntityContext,
  parseUnknownLegalEntityContext,
  serializeLegalEntityContext,
} from "./legal-entity-context.parser.js";
// ── Shared lifecycle vocabulary ──────────────────────────────────────────────
export {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";
export {
  type assertLocalizationContextWireSerializable,
  assertLocalizationText,
  assertWireLocalizationContext,
} from "./localization-context.assert.js";
// ── Localization vocabulary (shape only) ─────────────────────────────────────
export type {
  LocalizationContext,
  WireLocalizationContext,
} from "./localization-context.contract.js";
export {
  parseLocalizationContext,
  parseUnknownLocalizationContext,
  serializeLocalizationContext,
} from "./localization-context.parser.js";
export {
  assertOperatingContextOptionalText,
  assertOperatingContextText,
  type assertOperatingContextWireSerializable,
  assertWireOperatingContext,
} from "./operating-context.assert.js";
// ── 8. Operating context (composed) ──────────────────────────────────────────
export {
  OPERATING_CONTEXT_ERROR_CODES,
  type OperatingContext,
  type OperatingContextActor,
  type OperatingContextError,
  type OperatingContextErrorCode,
  type OperatingContextResult,
  type OperatingContextSelection,
  type OperatingContextWireContext,
  type SurfaceWireContext,
  type WorkflowWireContext,
  type WorkspaceWireContext,
} from "./operating-context.contract.js";
export {
  normalizeOperatingContextForWire,
  parseOperatingContext,
  parseUnknownOperatingContext,
  serializeOperatingContext,
} from "./operating-context.parser.js";
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
export {
  assertOrganizationUnitContextSlug,
  assertOrganizationUnitContextText,
  type assertOrganizationUnitContextWireSerializable,
  assertWireOrganizationUnitContext,
  isOrganizationUnitType,
} from "./organization-unit-context.assert.js";
// ── 5. Organization unit ─────────────────────────────────────────────────────
export {
  ORGANIZATION_UNIT_TYPES,
  type OrganizationUnitContext,
  type OrganizationUnitType,
  type OrganizationUnitWireContext,
} from "./organization-unit-context.contract.js";
export {
  normalizeOrganizationUnitContextForWire,
  parseOrganizationUnitContext,
  parseUnknownOrganizationUnitContext,
  serializeOrganizationUnitContext,
} from "./organization-unit-context.parser.js";
export {
  type assertOwnershipInterestContextWireSerializable,
  assertOwnershipInterestEffectiveDateRange,
  assertOwnershipInterestPercentage,
  assertWireOwnershipInterestContext,
  brandPercentageNumber,
  isConsolidationTreatment,
  isOwnershipControlType,
} from "./ownership-interest-context.assert.js";
// ── 4. Ownership interest ────────────────────────────────────────────────────
export {
  type BrandedOwnershipInterestContext,
  CONSOLIDATION_TREATMENTS,
  type ConsolidationTreatment,
  isOwnershipInterestEffectiveAt,
  OWNERSHIP_CONTROL_TYPES,
  type OwnershipControlType,
  type OwnershipInterestContext,
  type OwnershipInterestWireContext,
  type PercentageNumber,
} from "./ownership-interest-context.contract.js";
export {
  normalizeOwnershipInterestContextForWire,
  parseOwnershipInterestContext,
  parseUnknownOwnershipInterestContext,
  serializeOwnershipInterestContext,
} from "./ownership-interest-context.parser.js";
// ── 9. Permission scope ──────────────────────────────────────────────────────
export {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isPermissionGrantScopeType,
  PERMISSION_GRANT_SCOPE_TYPES,
  type PermissionGrantElevationFlags,
  type PermissionGrantScopeType,
} from "./permission-grant-vocabulary.contract.js";
export {
  type assertPermissionScopeContextJsonSerializable,
  assertPermissionScopeContextOptionalText,
  assertPermissionScopeContextText,
  type assertPermissionScopeContextWireSerializable,
  assertWirePermissionScopeContext,
} from "./permission-scope-context.assert.js";
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type PermissionScopeContext` export substring
export {
  type PermissionScopeContext,
  type PermissionScopeWireContext,
} from "./permission-scope-context.contract.js";
export {
  brandPermissionScopeContextFromUnknownWire,
  brandPermissionScopeContextFromWire,
  normalizePermissionScopeContextForWire,
  parsePermissionScopeContext,
  parseUnknownPermissionScopeContext,
  serializePermissionScopeContext,
} from "./permission-scope-context.projection.js";
export {
  assertProjectContextOptionalText,
  assertProjectContextSlug,
  assertProjectContextText,
  type assertProjectContextWireSerializable,
  assertWireProjectContext,
  isProjectLifecycleStatus,
} from "./project-context.assert.js";
// ── 7. Project ───────────────────────────────────────────────────────────────
export {
  PROJECT_LIFECYCLE_STATUSES,
  type ProjectContext,
  type ProjectLifecycleStatus,
  type ProjectWireContext,
} from "./project-context.contract.js";
export {
  normalizeProjectContextForWire,
  parseProjectContext,
  parseUnknownProjectContext,
  serializeProjectContext,
} from "./project-context.parser.js";
export {
  assertRoundingMode,
  assertWireRoundingModeVocabulary,
} from "./rounding-mode.assert.js";
// ── Rounding mode vocabulary (B112 · ADR-0029) ───────────────────────────────
export type {
  RoundingMode,
  RoundingModeVocabulary,
  WireRoundingModeVocabulary,
} from "./rounding-mode.contract.js";
export { isRoundingMode, ROUNDING_MODES } from "./rounding-mode.contract.js";
export {
  parseRoundingModeVocabulary,
  parseUnknownRoundingModeVocabulary,
  serializeRoundingModeVocabulary,
} from "./rounding-mode.parser.js";
export type {
  SurfaceContext,
  SurfaceId,
} from "./surface-context.contract.js";
export {
  assertTeamContextOptionalText,
  assertTeamContextSlug,
  assertTeamContextText,
  type assertTeamContextWireSerializable,
  assertWireTeamContext,
} from "./team-context.assert.js";
// ── 6. Team ──────────────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type TeamContext` export substring
export {
  type TeamAuthorityId,
  type TeamContext,
  type TeamWireContext,
} from "./team-context.contract.js";
export {
  normalizeTeamContextForWire,
  parseTeamContext,
  parseUnknownTeamContext,
  serializeTeamContext,
} from "./team-context.parser.js";
export {
  type assertTenantContextWireSerializable,
  assertWireTenantContext,
} from "./tenant-context.assert.js";
// ── 1. Tenant ────────────────────────────────────────────────────────────────
// biome-ignore lint/style/useExportType: kernel-context-surface gate requires `type TenantContext` export substring
export {
  type TenantContext,
  type TenantWireContext,
} from "./tenant-context.contract.js";
export {
  normalizeTenantContextForWire,
  parseTenantContext,
  parseUnknownTenantContext,
  serializeTenantContext,
} from "./tenant-context.parser.js";
export { assertWireTenantExtensionBoundaryVocabulary } from "./tenant-extension-boundary.assert.js";
export {
  assertTenantExtensionFieldKeyDoesNotForkKernelBrand,
  isTenantExtensionNonAuthoritativeKind,
  TENANT_EXTENSION_FORBIDDEN_FIELD_KEY_PATTERN,
  TENANT_EXTENSION_NON_AUTHORITATIVE_KINDS,
  type TenantExtensionBoundaryVocabulary,
  type TenantExtensionNonAuthoritativeKind,
  type WireTenantExtensionBoundaryVocabulary,
} from "./tenant-extension-boundary.contract.js";
export {
  parseTenantExtensionBoundaryVocabulary,
  parseUnknownTenantExtensionBoundaryVocabulary,
  serializeTenantExtensionBoundaryVocabulary,
} from "./tenant-extension-boundary.parser.js";
export { assertWireTenantSaasLifecycleVocabulary } from "./tenant-saas-lifecycle.assert.js";
export {
  isTenantSaasLifecyclePhase,
  TENANT_SAAS_LIFECYCLE_PHASES,
  type TenantSaasLifecyclePhase,
  type TenantSaasLifecycleVocabulary,
  type WireTenantSaasLifecycleVocabulary,
} from "./tenant-saas-lifecycle.contract.js";
export {
  parseTenantSaasLifecycleVocabulary,
  parseUnknownTenantSaasLifecycleVocabulary,
  serializeTenantSaasLifecycleVocabulary,
} from "./tenant-saas-lifecycle.parser.js";
export type {
  WorkflowContext,
  WorkflowId,
} from "./workflow-context.contract.js";
// ── Runtime / derived context (shape only) ───────────────────────────────────
export type { WorkspaceContext } from "./workspace-context.contract.js";
