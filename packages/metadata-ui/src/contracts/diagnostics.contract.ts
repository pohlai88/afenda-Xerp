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
  /**
   * Surface type currently being rendered.
   *
   * Examples: "page", "workspace", "module"
   */
  readonly surfaceType?: SurfaceType;
}

export interface MetadataDiagnosticsRendererSnapshot {
  /**
   * Renderer capability used during resolution.
   *
   * Examples: "render-list", "render-stat", "render-form"
   */
  readonly rendererCapability?: RendererCapability;
  /**
   * Renderer selected by the metadata renderer registry.
   */
  readonly rendererKey?: string;

  /**
   * Optional renderer version.
   */
  readonly rendererVersion?: string;
}

export interface MetadataDiagnosticsRuntimeSnapshot {
  /**
   * Correlation ID used for tracing render/runtime events.
   */
  readonly correlationId?: MetadataRuntimeCorrelationId;

  /**
   * Whether diagnostics are allowed to be shown.
   */
  readonly diagnosticsEnabled: boolean;

  /**
   * Whether the current metadata surface is readonly.
   */
  readonly readonlyMode: boolean;
  /**
   * Runtime state at the time diagnostics were captured.
   */
  readonly runtimeState: MetadataRuntimeState;
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
   * Optional actor currently in scope.
   */
  readonly actorId?: MetadataRuntimeActorId;

  /**
   * Optional company currently in scope.
   */
  readonly companyId?: MetadataRuntimeCompanyId;

  /**
   * Optional organization currently in scope.
   */
  readonly organizationId?: MetadataRuntimeOrganizationId;
  /**
   * Optional tenant currently in scope.
   */
  readonly tenantId?: MetadataRuntimeTenantId;

  /**
   * Optional workspace currently in scope.
   */
  readonly workspaceId?: MetadataRuntimeWorkspaceId;
}

export interface MetadataDiagnosticsSnapshot {
  readonly identity?: MetadataDiagnosticsIdentitySnapshot;
  readonly presentation: MetadataDiagnosticsPresentationSnapshot;
  readonly renderer?: MetadataDiagnosticsRendererSnapshot;
  readonly runtime: MetadataDiagnosticsRuntimeSnapshot;
  readonly surface?: MetadataDiagnosticsSurfaceSnapshot;
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
   * Optional renderer snapshot.
   */
  readonly renderer?: MetadataDiagnosticsRendererSnapshot;

  /**
   * Optional surface/layout/section snapshot.
   */
  readonly surface?: MetadataDiagnosticsSurfaceSnapshot;
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
