/**
 * Metadata UI render context contracts.
 *
 * Authority:
 * - Defines metadata-ui render boundary types and vocabulary.
 * - Wraps MetadataRuntimeContext from @afenda/ui-composition — does not duplicate it.
 */

import type { MetadataRuntimeContext } from "@afenda/ui-composition";

import type { MetadataUiThemePresentation } from "./theme-presentation.contract.js";

export const METADATA_UI_RENDER_SOURCES = [
  "client",
  "server",
  "static-preview",
] as const;

export type MetadataUiRenderSource =
  (typeof METADATA_UI_RENDER_SOURCES)[number];

export const METADATA_UI_HYDRATION_MODES = ["none", "partial", "full"] as const;

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
   * Whether deprecated renderers may still be selected.
   */
  readonly allowDeprecatedRenderers: boolean;

  /**
   * Whether experimental renderers may be selected.
   */
  readonly allowExperimentalRenderers: boolean;

  /**
   * Diagnostics verbosity for render policy decisions.
   */
  readonly diagnosticsLevel: MetadataUiDiagnosticsLevel;
  /**
   * Whether renderer failures should throw instead of degrading.
   *
   * Recommended: true in tests and CI previews; false in production surfaces.
   */
  readonly strict: boolean;
}

export interface MetadataUiRenderEnvironment {
  /**
   * Hydration expectation for the rendered output.
   */
  readonly hydration: MetadataUiHydrationMode;

  /**
   * Whether this render is running inside an interactive browser client.
   */
  readonly interactive: boolean;
  /**
   * Where this render is produced.
   */
  readonly source: MetadataUiRenderSource;
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
   * Diagnostics render state.
   */
  readonly diagnostics: MetadataUiRenderDiagnostics;

  /**
   * Render environment.
   */
  readonly environment: MetadataUiRenderEnvironment;

  /**
   * Render policy.
   */
  readonly policy: MetadataUiRenderPolicy;

  /**
   * Optional theme preset vocabulary (PAS-005A B42).
   */
  readonly presentation?: MetadataUiThemePresentation;
  /**
   * Metadata authority runtime context.
   *
   * Consumed, not owned, by metadata-ui.
   */
  readonly runtime: MetadataRuntimeContext;
}

export interface CreateMetadataUiRenderContextInput {
  /**
   * Whether deprecated renderers may be used. Defaults to false.
   */
  readonly allowDeprecatedRenderers?: boolean;

  /**
   * Whether experimental renderers may be used. Defaults to false.
   */
  readonly allowExperimentalRenderers?: boolean;

  /**
   * Diagnostics verbosity. Defaults to "off".
   */
  readonly diagnosticsLevel?: MetadataUiDiagnosticsLevel;

  /**
   * Optional diagnostics namespace.
   */
  readonly diagnosticsNamespace?: string;

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
   * Metadata runtime context from @afenda/ui-composition.
   */
  readonly runtime: MetadataRuntimeContext;

  /**
   * Render source.
   */
  readonly source: MetadataUiRenderSource;

  /**
   * Whether metadata-ui should throw on render contract failure.
   *
   * Defaults to false.
   */
  readonly strict?: boolean;

  /**
   * Optional shadcn/studio theme preset slug for diagnostics and ERP wiring.
   */
  readonly themePresetSlug?: MetadataUiThemePresentation["themePresetSlug"];
}

/** @deprecated Use CreateMetadataUiRenderContextInput */
export type CreateMetadataRenderContextInput =
  CreateMetadataUiRenderContextInput;
