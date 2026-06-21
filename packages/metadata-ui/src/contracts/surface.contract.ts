/**
 * Metadata surface contracts.
 *
 * Authority:
 * - Defines surface props for metadata-ui composition.
 * - Consumes SurfaceType and MetadataAction from @afenda/metadata.
 */

import type { SurfaceType } from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataRenderableAction } from "./action.contract.js";
import type { MetadataUiRenderContext } from "./render-context.contract.js";

export const METADATA_SURFACE_VISIBILITY_STATES = [
  "visible",
  "hidden",
  "disabled",
  "readonly",
] as const;

export type MetadataSurfaceVisibilityState =
  (typeof METADATA_SURFACE_VISIBILITY_STATES)[number];

export const METADATA_SURFACE_CHROME_MODES = [
  "none",
  "minimal",
  "standard",
  "immersive",
] as const;

export type MetadataSurfaceChromeMode =
  (typeof METADATA_SURFACE_CHROME_MODES)[number];

export const METADATA_SURFACE_WIDTH_MODES = [
  "fluid",
  "contained",
  "narrow",
  "wide",
] as const;

export type MetadataSurfaceWidthMode =
  (typeof METADATA_SURFACE_WIDTH_MODES)[number];

export interface MetadataSurfaceIdentity {
  /**
   * Stable surface instance ID.
   *
   * Examples: "system-admin-users", "invoice-detail", "hr-employee-profile"
   */
  readonly id: string;

  /**
   * Human-readable surface title.
   */
  readonly title: string;

  /**
   * Optional description shown in page headers or diagnostics.
   */
  readonly description?: string;
}

export interface MetadataSurfaceBreadcrumb {
  /**
   * Stable breadcrumb key.
   */
  readonly key: string;

  /**
   * Human-readable breadcrumb label.
   */
  readonly label: string;

  /**
   * Optional href.
   */
  readonly href?: string;
}

export interface MetadataSurfaceA11y {
  /**
   * Accessible label for the surface region.
   */
  readonly ariaLabel?: string;

  /**
   * ID of the element that labels the surface.
   */
  readonly ariaLabelledBy?: string;

  /**
   * ID of the element that describes the surface.
   */
  readonly ariaDescribedBy?: string;
}

export interface MetadataSurfaceState {
  /**
   * Surface visibility or interaction state.
   */
  readonly visibility: MetadataSurfaceVisibilityState;

  /**
   * Human-readable reason when visibility is not "visible".
   */
  readonly reason?: string;

  /**
   * Whether the surface is loading.
   */
  readonly loading?: boolean;

  /**
   * Whether the surface has no renderable content.
   */
  readonly empty?: boolean;

  /**
   * Optional error message safe for UI presentation.
   */
  readonly errorMessage?: string;
}

export interface MetadataSurfacePresentation {
  /**
   * Surface chrome style.
   */
  readonly chrome?: MetadataSurfaceChromeMode;

  /**
   * Surface width behavior.
   */
  readonly width?: MetadataSurfaceWidthMode;

  /**
   * Whether the surface should render internal spacing.
   */
  readonly padded?: boolean;

  /**
   * Optional governed class name from metadata-ui boundary.
   */
  readonly className?: string;
}

export interface MetadataSurfaceDiagnostics {
  /**
   * Optional layout renderer selected for this surface.
   */
  readonly layoutRendererKey?: string;

  /**
   * Optional surface renderer selected for this surface.
   */
  readonly surfaceRendererKey?: string;

  /**
   * Optional diagnostics note.
   */
  readonly note?: string;
}

export interface MetadataSurfaceSlots {
  /**
   * Optional surface header override.
   */
  readonly header?: ReactNode;

  /**
   * Optional toolbar, filters, or command row.
   */
  readonly toolbar?: ReactNode;

  /**
   * Main surface content.
   */
  readonly content: ReactNode;

  /**
   * Optional right-side or supporting panel.
   */
  readonly aside?: ReactNode;

  /**
   * Optional footer.
   */
  readonly footer?: ReactNode;
}

export interface MetadataSurfaceProps {
  /**
   * Stable surface identity.
   */
  readonly identity: MetadataSurfaceIdentity;

  /**
   * Governed surface type from @afenda/metadata.
   */
  readonly type: SurfaceType;

  /**
   * Current metadata-ui render context.
   */
  readonly context: MetadataUiRenderContext;

  /**
   * Structured surface slots with clear region ownership.
   */
  readonly slots: MetadataSurfaceSlots;

  /**
   * Optional breadcrumbs for surface heading/navigation context.
   */
  readonly breadcrumbs?: readonly MetadataSurfaceBreadcrumb[];

  /**
   * Surface-level actions with optional presentation metadata for rendering.
   */
  readonly actions?: readonly MetadataRenderableAction[];

  /**
   * Surface runtime state.
   */
  readonly state?: MetadataSurfaceState;

  /**
   * Accessibility metadata.
   */
  readonly a11y?: MetadataSurfaceA11y;

  /**
   * Presentation options owned by metadata-ui.
   */
  readonly presentation?: MetadataSurfacePresentation;

  /**
   * Optional diagnostics metadata.
   */
  readonly diagnostics?: MetadataSurfaceDiagnostics;
}

export type MetadataSpecificSurfaceProps = Omit<MetadataSurfaceProps, "type">;

export type MetadataPageSurfaceProps = MetadataSpecificSurfaceProps;
export type MetadataWorkspaceSurfaceProps = MetadataSpecificSurfaceProps;
export type MetadataModuleSurfaceProps = MetadataSpecificSurfaceProps;
