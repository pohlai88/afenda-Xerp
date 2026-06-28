// biome-ignore-all lint/performance/noBarrelFile: Foundation phase 07 shared entry surface.
export const PACKAGE_NAME = "@afenda/metadata-ui" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  actionRequiresConfirmation,
  createMetadataActionFailure,
  createMetadataActionInternalError,
  createMetadataActionSuccess,
  destructiveActionMissingConfirm,
  isDestructiveMetadataAction,
  isMetadataActionFailure,
  isMetadataActionSuccess,
  toMetadataActionWireResult,
} from "./actions/metadata-action-handler.js";
export {
  compareRenderableActions,
  countVisiblePrimaryActions,
  createMultiplePrimaryActionsWarning,
  getMetadataActionReasonId,
  getMetadataActionVisibility,
  isMetadataActionDisabled,
  isMetadataActionHidden,
  resolveMetadataActionGroup,
  shouldOpenInNewTab,
  sortRenderableActions,
} from "./actions/metadata-action-presentation.js";
export type {
  MetadataAction,
  MetadataActionAccess,
  MetadataActionAudit,
  MetadataActionConfirm,
  MetadataActionContext,
  MetadataActionErrorCode,
  MetadataActionFailureResult,
  MetadataActionFailureWireResult,
  MetadataActionGroup,
  MetadataActionHandler,
  MetadataActionKind,
  MetadataActionPresentation,
  MetadataActionResult,
  MetadataActionResultHandler,
  MetadataActionSuccessResult,
  MetadataActionSuccessWireResult,
  MetadataActionTarget,
  MetadataActionVisibilityState,
  MetadataActionWireResult,
  MetadataRenderableAction,
} from "./contracts/action.contract.js";
export {
  METADATA_ACTION_ERROR_CODES,
  METADATA_ACTION_GROUPS,
} from "./contracts/action.contract.js";
export type {
  CreateMetadataDiagnosticsSnapshotInput,
  MetadataBoundaryWarningProps,
  MetadataDiagnosticsIdentitySnapshot,
  MetadataDiagnosticsPresentationSnapshot,
  MetadataDiagnosticsProps,
  MetadataDiagnosticsRendererSnapshot,
  MetadataDiagnosticsRuntimeSnapshot,
  MetadataDiagnosticsSnapshot,
  MetadataDiagnosticsSurfaceSnapshot,
} from "./contracts/diagnostics.contract.js";
export type {
  MetadataLayoutA11y,
  MetadataLayoutDiagnostics,
  MetadataLayoutIdentity,
  MetadataLayoutPresentation,
  MetadataLayoutProps,
  MetadataLayoutRegion,
  MetadataLayoutSlots,
  MetadataSpecificLayoutProps,
} from "./contracts/layout.contract.js";
export { METADATA_LAYOUT_REGIONS } from "./contracts/layout.contract.js";
export type {
  MetadataUiRenderRefreshEventName,
  MetadataUiRenderRefreshHint,
  MetadataUiRenderRefreshSurface,
} from "./contracts/metadata-domain-event-vocabulary.contract.js";
export {
  isMetadataUiRenderRefreshEventName,
  METADATA_UI_RENDER_REFRESH_EVENT_NAMES,
  METADATA_UI_RENDER_REFRESH_SURFACES,
  resolveMetadataUiRenderRefreshHint,
} from "./contracts/metadata-domain-event-vocabulary.contract.js";
export type { MetadataUiContract } from "./contracts/metadata-ui.contract.js";
export {
  METADATA_UI_AUTHORITY,
  METADATA_UI_CONSUMES,
  METADATA_UI_CONTRACT_VERSION,
  METADATA_UI_DOES_NOT_OWN,
  METADATA_UI_OWNS,
  METADATA_UI_PACKAGE_NAME,
  METADATA_UI_PROHIBITS,
  metadataUiContract,
} from "./contracts/metadata-ui.contract.js";
export type {
  MetadataUiThemePresentation,
  MetadataUiThemePresetSlug,
} from "./contracts/presentation.contract.js";
export {
  isMetadataUiThemePresetSlug,
  METADATA_UI_THEME_PRESET_SLUGS,
} from "./contracts/presentation.contract.js";
export type {
  CreateMetadataRenderContextInput,
  CreateMetadataUiRenderContextInput,
  MetadataUiDiagnosticsLevel,
  MetadataUiHydrationMode,
  MetadataUiRenderContext,
  MetadataUiRenderDiagnostics,
  MetadataUiRenderEnvironment,
  MetadataUiRenderPolicy,
  MetadataUiRenderSource,
} from "./contracts/render-context.contract.js";
export {
  METADATA_UI_DIAGNOSTICS_LEVELS,
  METADATA_UI_HYDRATION_MODES,
  METADATA_UI_RENDER_SOURCES,
} from "./contracts/render-context.contract.js";
export type {
  AnyMetadataRendererDefinition,
  MetadataRendererDefinition,
  MetadataRendererDiagnostics,
  MetadataRendererExecutionDiagnostics,
  MetadataRendererGovernance,
  MetadataRendererIdentity,
  MetadataRendererLifecycleState,
  MetadataRendererPolicy,
  MetadataRendererResolveFailure,
  MetadataRendererResolveFailureReason,
  MetadataRendererResolveInput,
  MetadataRendererResolveResult,
  MetadataRendererResult,
  MetadataRendererSupportResult,
} from "./contracts/renderer-definition.contract.js";
export {
  METADATA_RENDERER_LIFECYCLE_STATES,
  METADATA_RENDERER_RESOLVE_FAILURE_REASONS,
} from "./contracts/renderer-definition.contract.js";
export type {
  MetadataSectionA11y,
  MetadataSectionChromeMode,
  MetadataSectionDiagnostics,
  MetadataSectionIdentity,
  MetadataSectionPresentation,
  MetadataSectionProps,
  MetadataSectionSlots,
  MetadataSectionState,
  MetadataSectionVisibilityState,
  MetadataSpecificSectionProps,
} from "./contracts/section.contract.js";
export {
  METADATA_SECTION_CHROME_MODES,
  METADATA_SECTION_VISIBILITY_STATES,
} from "./contracts/section.contract.js";
export type {
  MetadataSpecificStateProps,
  MetadataStateCopy,
  MetadataStateProps,
  MetadataStateSlots,
} from "./contracts/state.contract.js";
export type {
  MetadataModuleSurfaceProps,
  MetadataPageSurfaceProps,
  MetadataSpecificSurfaceProps,
  MetadataSurfaceA11y,
  MetadataSurfaceBreadcrumb,
  MetadataSurfaceChromeMode,
  MetadataSurfaceDiagnostics,
  MetadataSurfaceIdentity,
  MetadataSurfacePresentation,
  MetadataSurfaceProps,
  MetadataSurfaceSlots,
  MetadataSurfaceState,
  MetadataSurfaceVisibilityState,
  MetadataSurfaceWidthMode,
  MetadataWorkspaceSurfaceProps,
} from "./contracts/surface.contract.js";
export {
  METADATA_SURFACE_CHROME_MODES,
  METADATA_SURFACE_VISIBILITY_STATES,
  METADATA_SURFACE_WIDTH_MODES,
} from "./contracts/surface.contract.js";
export type {
  MetadataTenantHumanReferenceFieldBinding,
  MetadataTenantHumanReferenceScope,
  MetadataTenantHumanReferenceWireValue,
} from "./contracts/tenant-human-reference-field.contract.js";
export {
  assertMetadataTenantHumanReferenceWireShape,
  isMetadataTenantHumanReferenceFieldBinding,
  isMetadataTenantHumanReferenceScope,
  METADATA_TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPE_COLUMNS,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPE_LABELS,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPES,
  normalizeMetadataTenantHumanReferenceWireValue,
  serializeMetadataTenantHumanReferenceFieldBinding,
} from "./contracts/tenant-human-reference-field.contract.js";
export { createMetadataDiagnosticsSnapshot } from "./diagnostics/index.js";
export {
  SAMPLE_METADATA_UI_FIXTURE_NAMESPACE,
  SAMPLE_METADATA_UI_RENDER_SOURCE_CLIENT,
  SAMPLE_METADATA_UI_RENDER_SOURCE_SERVER,
  SAMPLE_METADATA_UI_RENDER_SOURCE_STATIC_PREVIEW,
  SAMPLE_RUNTIME_CORRELATION_ID,
  sampleClientRenderContext,
  sampleClientRenderContextInput,
  sampleDiagnosticsRenderContext,
  sampleDiagnosticsRenderContextInput,
  sampleDiagnosticsRuntimeContext,
  sampleDiagnosticsRuntimeContextInput,
  sampleReadonlyRenderContext,
  sampleReadonlyRenderContextInput,
  sampleReadonlyRuntimeContext,
  sampleReadonlyRuntimeContextInput,
  sampleRenderContext,
  sampleRenderContextInput,
  sampleRuntimeContext,
  sampleRuntimeContextFixture,
  sampleRuntimeContextInput,
  sampleStrictRenderContext,
  sampleStrictRenderContextInput,
  sampleVerboseDiagnosticsRenderContext,
  sampleVerboseDiagnosticsRenderContextInput,
} from "./fixtures/sample-runtime-context.fixture.js";
export {
  isPlatformIdentityKnowledgeAtomId,
  METADATA_PLATFORM_IDENTITY_DIMENSION_ATOM_IDS,
  type MetadataPlatformIdentityDimensionAtomId,
  PLATFORM_IDENTITY_KNOWLEDGE_ATOM_IDS,
  type PlatformIdentityKnowledgeAtomId,
  resolveMetadataPlatformIdentityDimensionLabel,
  resolveMetadataTenantHumanReferenceConceptLabel,
  resolveMetadataTenantHumanReferenceScopeLabel,
  resolvePlatformIdentityKnowledgeBusinessTitle,
  resolvePlatformIdentityKnowledgeCanonicalDefinition,
  resolvePlatformIdentityKnowledgeLabel,
} from "./knowledge/index.js";
export type {
  LegacyMetadataVisibilityInput,
  MetadataVisibilityInput,
  MetadataVisibilityReason,
  MetadataVisibilityResult,
  MetadataVisibilityState,
} from "./presentation/index.js";
export {
  METADATA_VISIBILITY_REASONS,
  METADATA_VISIBILITY_STATES,
  normalizeLegacyVisibilityInput,
  resolveDensityMode,
  resolvePresentationMode,
  resolveReadonlyMode,
  resolveVisibility,
} from "./presentation/index.js";
export type {
  CreateMetadataRendererDefinitionInput,
  MetadataRendererRegistry,
  MetadataRendererRegistryResolveInput,
  MetadataRendererResolveInputRegistry,
} from "./registry/index.js";
export {
  createDefaultMetadataRendererRegistry,
  createMetadataRendererDefinition,
  createMetadataRendererRegistry,
  defaultMetadataRendererRegistry,
  isRendererCapabilityCompatible,
  resolveMetadataRenderer,
} from "./registry/index.js";
export type {
  CreateSectionRendererInput,
  MetadataSectionRendererComponent,
  SectionRendererSpec,
} from "./renderers/index.js";
export {
  actionRenderer,
  auditRenderer,
  chartRenderer,
  createSectionRenderer,
  DEFAULT_SECTION_RENDERER_OWNER_PACKAGE,
  DEFAULT_SECTION_RENDERER_VERSION,
  defaultMetadataRenderers,
  detailRenderer,
  formRenderer,
  listRenderer,
  statRenderer,
} from "./renderers/index.js";
export type { MetadataUiForbiddenPackageImport } from "./runtime/index.js";
export {
  assertMetadataUiBoundary,
  createMetadataRenderContext,
  createMetadataUiRenderContext,
  DEFAULT_METADATA_UI_HYDRATION_BY_SOURCE,
  getDefaultMetadataUiHydrationMode,
  isMetadataUiError,
  METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS,
  MetadataUiError,
  resolveMetadataRenderState,
} from "./runtime/index.js";
