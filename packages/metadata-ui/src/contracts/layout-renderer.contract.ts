/**
 * Metadata layout renderer contracts.
 *
 * Authority:
 * - Defines layout renderer props for metadata-ui composition.
 * - Consumes LayoutType from @afenda/metadata — does not redefine layout vocabulary.
 * - Does not own design tokens or metadata authority.
 */

import type { LayoutType } from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export const METADATA_LAYOUT_REGIONS = [
  "header",
  "toolbar",
  "aside",
  "content",
  "footer",
] as const;

export type MetadataLayoutRegion = (typeof METADATA_LAYOUT_REGIONS)[number];

export interface MetadataLayoutIdentity {
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

  /**
   * Optional description for diagnostics or development previews.
   */
  readonly description?: string;
}

export interface MetadataLayoutA11y {
  /**
   * Accessible label for the layout region, usually applied to the root container.
   */
  readonly ariaLabel?: string;

  /**
   * ID of an element that labels the layout.
   */
  readonly ariaLabelledBy?: string;

  /**
   * ID of an element that describes the layout.
   */
  readonly ariaDescribedBy?: string;
}

export interface MetadataLayoutPresentation {
  /**
   * Optional CSS class supplied by the renderer boundary.
   *
   * Prefer governed classes from metadata-ui layout registries — not a design-token escape hatch.
   */
  readonly className?: string;

  /**
   * Optional slot class names by layout region for controlled internal styling.
   */
  readonly regionClassNames?: Partial<Record<MetadataLayoutRegion, string>>;

  /**
   * Whether the layout should visually constrain its content width.
   */
  readonly contained?: boolean;

  /**
   * Whether the layout should render internal spacing.
   */
  readonly padded?: boolean;
}

export interface MetadataLayoutDiagnostics {
  /**
   * Optional renderer key selected for this layout.
   */
  readonly rendererKey?: string;

  /**
   * Optional renderer version.
   */
  readonly rendererVersion?: string;

  /**
   * Optional note for diagnostics panels.
   */
  readonly note?: string;
}

export interface MetadataLayoutSlots {
  /**
   * Optional layout header.
   */
  readonly header?: ReactNode;

  /**
   * Optional action or filter toolbar.
   */
  readonly toolbar?: ReactNode;

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
}

export interface MetadataLayoutProps {
  /**
   * Stable layout identity.
   */
  readonly identity: MetadataLayoutIdentity;

  /**
   * Governed layout type from @afenda/metadata.
   */
  readonly type: LayoutType;

  /**
   * Current metadata-ui render context.
   */
  readonly context: MetadataUiRenderContext;

  /**
   * Structured layout slots with clear region ownership.
   */
  readonly slots: MetadataLayoutSlots;

  /**
   * Accessibility metadata.
   */
  readonly a11y?: MetadataLayoutA11y;

  /**
   * Presentation options owned by metadata-ui renderers.
   */
  readonly presentation?: MetadataLayoutPresentation;

  /**
   * Optional diagnostics metadata.
   */
  readonly diagnostics?: MetadataLayoutDiagnostics;
}
