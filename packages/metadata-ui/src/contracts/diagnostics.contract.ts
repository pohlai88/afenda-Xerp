/**
 * Metadata diagnostics contracts.
 *
 * Authority:
 * - Defines normalized diagnostics snapshot shapes for metadata UI rendering.
 * - Consumes governed vocabulary from @afenda/metadata — does not redefine it.
 * - Does not execute logging, tracing, or observability services.
 */

import type {
  LayoutType,
  MetadataDensityMode,
  MetadataRuntimeActorId,
  MetadataRuntimeCompanyId,
  MetadataRuntimeCorrelationId,
  MetadataRuntimeOrganizationId,
  MetadataRuntimeState,
  MetadataRuntimeTenantId,
  MetadataRuntimeWorkspaceId,
  PresentationMode,
  RendererCapability,
  SectionType,
  SurfaceType,
} from "@afenda/metadata";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export interface MetadataDiagnosticsSurfaceSnapshot {
  /**
   * Surface type currently being rendered.
   *
   * Examples: "page", "workspace", "module"
   */
  readonly surfaceType?: SurfaceType;

  /**
   * Layout type selected for the surface.
   *
   * Examples: "dashboard", "grid", "panel", "stack", "tabs", "wizard"
   */
  readonly layoutType?: LayoutType;

  /**
   * Section type currently being rendered.
   *
   * Examples: "list", "stat", "chart", "form", "detail", "audit", "action"
   */
  readonly sectionType?: SectionType;
}

export interface MetadataDiagnosticsRendererSnapshot {
  /**
   * Renderer selected by the metadata renderer registry.
   */
  readonly rendererKey?: string;

  /**
   * Renderer capability used during resolution.
   *
   * Examples: "render-list", "render-stat", "render-form"
   */
  readonly rendererCapability?: RendererCapability;

  /**
   * Optional renderer version.
   */
  readonly rendererVersion?: string;
}

export interface MetadataDiagnosticsRuntimeSnapshot {
  /**
   * Runtime state at the time diagnostics were captured.
   */
  readonly runtimeState: MetadataRuntimeState;

  /**
   * Whether the current metadata surface is readonly.
   */
  readonly readonlyMode: boolean;

  /**
   * Whether diagnostics are allowed to be shown.
   */
  readonly diagnosticsEnabled: boolean;

  /**
   * Correlation ID used for tracing render/runtime events.
   */
  readonly correlationId?: MetadataRuntimeCorrelationId;
}

export interface MetadataDiagnosticsPresentationSnapshot {
  /**
   * Density selected for the current metadata UI surface.
   */
  readonly densityMode: MetadataDensityMode;

  /**
   * Presentation mode selected for the current metadata UI surface.
   */
  readonly presentationMode: PresentationMode;
}

export interface MetadataDiagnosticsIdentitySnapshot {
  /**
   * Optional tenant currently in scope.
   */
  readonly tenantId?: MetadataRuntimeTenantId;

  /**
   * Optional company currently in scope.
   */
  readonly companyId?: MetadataRuntimeCompanyId;

  /**
   * Optional organization currently in scope.
   */
  readonly organizationId?: MetadataRuntimeOrganizationId;

  /**
   * Optional workspace currently in scope.
   */
  readonly workspaceId?: MetadataRuntimeWorkspaceId;

  /**
   * Optional actor currently in scope.
   */
  readonly actorId?: MetadataRuntimeActorId;
}

export interface MetadataDiagnosticsSnapshot {
  readonly identity?: MetadataDiagnosticsIdentitySnapshot;
  readonly surface?: MetadataDiagnosticsSurfaceSnapshot;
  readonly renderer?: MetadataDiagnosticsRendererSnapshot;
  readonly runtime: MetadataDiagnosticsRuntimeSnapshot;
  readonly presentation: MetadataDiagnosticsPresentationSnapshot;
}

export interface MetadataDiagnosticsProps {
  /**
   * Full render context supplied by the metadata UI runtime.
   */
  readonly context: MetadataUiRenderContext;

  /**
   * Normalized diagnostics snapshot safe for rendering, logging, and tests.
   */
  readonly snapshot: MetadataDiagnosticsSnapshot;
}

export interface CreateMetadataDiagnosticsSnapshotInput {
  /**
   * Optional identity override or extension.
   *
   * Useful for tests, static previews, sanitized diagnostics, or scoped renderers.
   */
  readonly identity?: MetadataDiagnosticsIdentitySnapshot;

  /**
   * Optional surface/layout/section snapshot.
   */
  readonly surface?: MetadataDiagnosticsSurfaceSnapshot;

  /**
   * Optional renderer snapshot.
   */
  readonly renderer?: MetadataDiagnosticsRendererSnapshot;
}

export interface MetadataBoundaryWarningProps {
  /**
   * Current metadata-ui render context.
   */
  readonly context: MetadataUiRenderContext;

  /**
   * Boundary-safe warning message for diagnostics surfaces.
   */
  readonly message: string;
}
