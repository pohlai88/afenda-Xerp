/**
 * Metadata layout contracts.
 *
 * Authority:
 * - Defines layout props for metadata-ui composition.
 * - Consumes LayoutType from @afenda/ui-composition — does not redefine layout vocabulary.
 * - Does not own design tokens or metadata authority.
 */

import type { LayoutType } from "@afenda/ui-composition";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export const METADATA_LAYOUT_REGIONS = [
  "header",
  "toolbar",
  "body",
  "aside",
  "content",
  "footer",
] as const;

export type MetadataLayoutRegion = (typeof METADATA_LAYOUT_REGIONS)[number];

export interface MetadataLayoutIdentity {
  /**
   * Optional description for diagnostics or development previews.
   */
  readonly description?: string;
  /**
   * Stable layout instance ID.
   *
   * Examples: "user-management-list-layout", "invoice-detail-tabs-layout"
   */
  readonly id: string;

  /**
   * Optional human-readable layout label for diagnostics, previews, and Storybook.
   */
  readonly label?: string;
}

export interface MetadataLayoutA11y {
  /**
   * ID of an element that describes the layout.
   */
  readonly ariaDescribedBy?: string;
  /**
   * Accessible label for the layout region, usually applied to the root container.
   */
  readonly ariaLabel?: string;

  /**
   * ID of an element that labels the layout.
   */
  readonly ariaLabelledBy?: string;
}

export interface MetadataLayoutPresentation {
  /**
   * Optional CSS class supplied by the renderer boundary.
   *
   * Prefer governed classes from metadata-ui layout registries — not a design-token escape hatch.
   */
  readonly className?: string;

  /**
   * Whether the layout should visually constrain its content width.
   */
  readonly contained?: boolean;

  /**
   * Whether the layout should render internal spacing.
   */
  readonly padded?: boolean;

  /**
   * Optional slot class names by layout region for controlled internal styling.
   */
  readonly regionClassNames?: Partial<Record<MetadataLayoutRegion, string>>;
}

export interface MetadataLayoutDiagnostics {
  /**
   * Optional note for diagnostics panels.
   */
  readonly note?: string;
  /**
   * Optional renderer key selected for this layout.
   */
  readonly rendererKey?: string;

  /**
   * Optional renderer version.
   */
  readonly rendererVersion?: string;
}

export interface MetadataLayoutSlots {
  /**
   * Optional side content.
   */
  readonly aside?: ReactNode;

  /**
   * Main layout content.
   */
  readonly content: ReactNode;

  /**
   * Optional layout footer.
   */
  readonly footer?: ReactNode;
  /**
   * Optional layout header.
   */
  readonly header?: ReactNode;

  /**
   * Optional action or filter toolbar.
   */
  readonly toolbar?: ReactNode;
}

export interface MetadataLayoutProps {
  /**
   * Accessibility metadata.
   */
  readonly a11y?: MetadataLayoutA11y;

  /**
   * Current metadata-ui render context.
   */
  readonly context: MetadataUiRenderContext;

  /**
   * Optional diagnostics metadata.
   */
  readonly diagnostics?: MetadataLayoutDiagnostics;
  /**
   * Stable layout identity.
   */
  readonly identity: MetadataLayoutIdentity;

  /**
   * Presentation options owned by metadata-ui renderers.
   */
  readonly presentation?: MetadataLayoutPresentation;

  /**
   * Structured layout slots with clear region ownership.
   */
  readonly slots: MetadataLayoutSlots;

  /**
   * Governed layout type from @afenda/ui-composition.
   */
  readonly type: LayoutType;
}

export type MetadataSpecificLayoutProps = Omit<MetadataLayoutProps, "type">;
