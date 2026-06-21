/**
 * Metadata UI render context contracts.
 *
 * Authority:
 * - Defines metadata-ui render boundary types and vocabulary.
 * - Wraps MetadataRuntimeContext from @afenda/metadata — does not duplicate it.
 */

import type { MetadataRuntimeContext } from "@afenda/metadata";

export const METADATA_UI_RENDER_SOURCES = [
  "client",
  "server",
  "static-preview",
] as const;

export type MetadataUiRenderSource =
  (typeof METADATA_UI_RENDER_SOURCES)[number];

export const METADATA_UI_HYDRATION_MODES = [
  "none",
  "partial",
  "full",
] as const;

export type MetadataUiHydrationMode =
  (typeof METADATA_UI_HYDRATION_MODES)[number];

export const METADATA_UI_DIAGNOSTICS_LEVELS = [
  "off",
  "summary",
  "verbose",
] as const;

export type MetadataUiDiagnosticsLevel =
  (typeof METADATA_UI_DIAGNOSTICS_LEVELS)[number];

export interface MetadataUiRenderPolicy {
  /**
   * Whether renderer failures should throw instead of degrading.
   *
   * Recommended: true in tests and CI previews; false in production surfaces.
   */
  readonly strict: boolean;

  /**
   * Diagnostics verbosity for render policy decisions.
   */
  readonly diagnosticsLevel: MetadataUiDiagnosticsLevel;

  /**
   * Whether experimental renderers may be selected.
   */
  readonly allowExperimentalRenderers: boolean;

  /**
   * Whether deprecated renderers may still be selected.
   */
  readonly allowDeprecatedRenderers: boolean;
}

export interface MetadataUiRenderEnvironment {
  /**
   * Where this render is produced.
   */
  readonly source: MetadataUiRenderSource;

  /**
   * Hydration expectation for the rendered output.
   */
  readonly hydration: MetadataUiHydrationMode;

  /**
   * Whether this render is running inside an interactive browser client.
   */
  readonly interactive: boolean;
}

export interface MetadataUiRenderDiagnostics {
  /**
   * Whether diagnostics UI is enabled.
   */
  readonly enabled: boolean;

  /**
   * Diagnostics verbosity level.
   */
  readonly level: MetadataUiDiagnosticsLevel;

  /**
   * Optional diagnostics namespace for grouping logs or panels.
   *
   * Examples: "metadata-ui.surface", "metadata-ui.renderer"
   */
  readonly namespace?: string;
}

export interface MetadataUiRenderContext {
  /**
   * Metadata authority runtime context.
   *
   * Consumed, not owned, by metadata-ui.
   */
  readonly runtime: MetadataRuntimeContext;

  /**
   * Render environment.
   */
  readonly environment: MetadataUiRenderEnvironment;

  /**
   * Render policy.
   */
  readonly policy: MetadataUiRenderPolicy;

  /**
   * Diagnostics render state.
   */
  readonly diagnostics: MetadataUiRenderDiagnostics;
}

export interface CreateMetadataUiRenderContextInput {
  /**
   * Metadata runtime context from @afenda/metadata.
   */
  readonly runtime: MetadataRuntimeContext;

  /**
   * Render source.
   */
  readonly source: MetadataUiRenderSource;

  /**
   * Hydration expectation.
   *
   * Defaults based on source:
   * - server: "none"
   * - client: "full"
   * - static-preview: "none"
   */
  readonly hydration?: MetadataUiHydrationMode;

  /**
   * Whether metadata-ui should throw on render contract failure.
   *
   * Defaults to false.
   */
  readonly strict?: boolean;

  /**
   * Diagnostics verbosity. Defaults to "off".
   */
  readonly diagnosticsLevel?: MetadataUiDiagnosticsLevel;

  /**
   * Optional diagnostics namespace.
   */
  readonly diagnosticsNamespace?: string;

  /**
   * Whether experimental renderers may be used. Defaults to false.
   */
  readonly allowExperimentalRenderers?: boolean;

  /**
   * Whether deprecated renderers may be used. Defaults to false.
   */
  readonly allowDeprecatedRenderers?: boolean;
}

/** @deprecated Use CreateMetadataUiRenderContextInput */
export type CreateMetadataRenderContextInput = CreateMetadataUiRenderContextInput;
