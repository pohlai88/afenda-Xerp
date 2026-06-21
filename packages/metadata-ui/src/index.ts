// biome-ignore-all lint/performance/noBarrelFile: TIP-007 requires stable shared exports.
export const PACKAGE_NAME = "@afenda/metadata-ui" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  metadataUiContract,
  METADATA_UI_AUTHORITY,
  METADATA_UI_CONSUMES,
  METADATA_UI_CONTRACT_VERSION,
  METADATA_UI_DOES_NOT_OWN,
  METADATA_UI_OWNS,
  METADATA_UI_PACKAGE_NAME,
  METADATA_UI_PROHIBITS,
} from "./contracts/metadata-ui.contract.js";
export type { MetadataUiContract } from "./contracts/metadata-ui.contract.js";
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
export { createMetadataRendererDefinition } from "./registry/create-metadata-renderer-definition.js";
export type {
  MetadataAction,
  MetadataActionAccess,
  MetadataActionAudit,
  MetadataActionConfirm,
  MetadataActionContext,
  MetadataActionHandler,
  MetadataActionKind,
  MetadataActionPresentation,
  MetadataActionResult,
  MetadataActionTarget,
  MetadataActionVisibilityState,
} from "./contracts/action-renderer.contract.js";
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
} from "./contracts/section-renderer.contract.js";
export {
  METADATA_SECTION_CHROME_MODES,
  METADATA_SECTION_VISIBILITY_STATES,
} from "./contracts/section-renderer.contract.js";
export type { MetadataSurfaceProps } from "./contracts/surface-renderer.contract.js";
export type {
  MetadataLayoutA11y,
  MetadataLayoutDiagnostics,
  MetadataLayoutIdentity,
  MetadataLayoutPresentation,
  MetadataLayoutProps,
  MetadataLayoutRegion,
  MetadataLayoutSlots,
} from "./contracts/layout-renderer.contract.js";
export { METADATA_LAYOUT_REGIONS } from "./contracts/layout-renderer.contract.js";
export type {
  CreateMetadataDiagnosticsSnapshotInput,
  MetadataDiagnosticsIdentitySnapshot,
  MetadataDiagnosticsPresentationSnapshot,
  MetadataDiagnosticsProps,
  MetadataDiagnosticsRendererSnapshot,
  MetadataDiagnosticsRuntimeSnapshot,
  MetadataDiagnosticsSnapshot,
  MetadataDiagnosticsSurfaceSnapshot,
} from "./contracts/diagnostics.contract.js";

export {
  createMetadataUiRenderContext,
  createMetadataRenderContext,
  getDefaultMetadataUiHydrationMode,
} from "./runtime/create-metadata-ui-render-context.js";
export { createMetadataDiagnosticsSnapshot } from "./diagnostics/create-metadata-diagnostics-snapshot.js";
export { resolveMetadataRenderState } from "./runtime/resolve-metadata-render-state.js";
export { assertMetadataUiBoundary } from "./runtime/assert-metadata-ui-boundary.js";
export { MetadataUiError, isMetadataUiError } from "./runtime/metadata-ui-error.js";

export {
  createMetadataRendererRegistry,
  isRendererCapabilityCompatible,
} from "./registry/metadata-renderer-registry.js";
export type {
  MetadataRendererRegistry,
  MetadataRendererResolveInput,
} from "./registry/metadata-renderer-registry.types.js";
export { resolveMetadataRenderer } from "./registry/resolve-metadata-renderer.js";
export {
  createDefaultMetadataRendererRegistry,
  defaultMetadataRendererRegistry,
  defaultMetadataRenderers,
} from "./registry/default-renderer-registry.js";

export {
  resolvePresentationMode,
  resolveDensityMode,
  resolveReadonlyMode,
  resolveVisibility,
} from "./presentation/resolve-presentation-mode.js";
export type {
  MetadataVisibilityInput,
  MetadataVisibilityResult,
} from "./presentation/resolve-presentation-mode.js";

export {
  sampleDiagnosticsRenderContext,
  sampleDiagnosticsRuntimeContext,
  sampleRenderContext,
  sampleRuntimeContext,
} from "./fixtures/sample-runtime-context.fixture.js";
