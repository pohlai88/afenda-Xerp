// biome-ignore-all lint/performance/noBarrelFile: TIP-007 requires stable shared exports.
export const PACKAGE_NAME = "@afenda/metadata-ui" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export { metadataUiContract } from "./contracts/metadata-ui.contract.js";
export type {
  CreateMetadataRenderContextInput,
  MetadataUiRenderContext,
  MetadataUiRenderSource,
} from "./contracts/render-context.contract.js";
export type { MetadataRendererDefinition } from "./contracts/renderer-definition.contract.js";
export type {
  MetadataAction,
  MetadataActionConfirm,
  MetadataActionHandler,
  MetadataActionKind,
} from "./contracts/action-renderer.contract.js";
export type { MetadataSectionProps } from "./contracts/section-renderer.contract.js";
export type { MetadataSurfaceProps } from "./contracts/surface-renderer.contract.js";
export type { MetadataLayoutProps } from "./contracts/layout-renderer.contract.js";
export type {
  MetadataDiagnosticsProps,
  MetadataDiagnosticsSnapshot,
} from "./contracts/diagnostics.contract.js";

export { createMetadataRenderContext } from "./runtime/create-metadata-render-context.js";
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
