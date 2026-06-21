/**
 * Metadata section contracts.
 *
 * Authority:
 * - Defines section props for metadata-ui composition.
 * - Consumes SectionType from @afenda/metadata — does not redefine section vocabulary.
 */

import type { SectionType } from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export const METADATA_SECTION_VISIBILITY_STATES = [
  "visible",
  "hidden",
  "collapsed",
  "disabled",
] as const;

export type MetadataSectionVisibilityState =
  (typeof METADATA_SECTION_VISIBILITY_STATES)[number];

export const METADATA_SECTION_CHROME_MODES = [
  "none",
  "minimal",
  "card",
  "panel",
] as const;

export type MetadataSectionChromeMode =
  (typeof METADATA_SECTION_CHROME_MODES)[number];

export interface MetadataSectionIdentity {
  /**
   * Stable section instance ID.
   *
   * Examples: "user-list-section", "invoice-summary-section"
   */
  readonly id: string;

  /**
   * Optional human-readable title.
   */
  readonly title?: string;

  /**
   * Optional description shown below title or used in diagnostics.
   */
  readonly description?: string;
}

export interface MetadataSectionA11y {
  /**
   * Accessible label for the section region.
   */
  readonly ariaLabel?: string;

  /**
   * ID of the element that labels the section.
   */
  readonly ariaLabelledBy?: string;

  /**
   * ID of the element that describes the section.
   */
  readonly ariaDescribedBy?: string;
}

export interface MetadataSectionPresentation {
  /**
   * How much visual chrome the section renderer should apply.
   */
  readonly chrome?: MetadataSectionChromeMode;

  /**
   * Whether the section should render internal spacing.
   */
  readonly padded?: boolean;

  /**
   * Optional governed class name from metadata-ui renderer boundary.
   */
  readonly className?: string;
}

export interface MetadataSectionState {
  /**
   * Section visibility state. Prefer this over separate hidden/disabled booleans.
   */
  readonly visibility: MetadataSectionVisibilityState;

  /**
   * Reason shown in diagnostics or disabled/hidden UI.
   *
   * Required by convention when visibility is not "visible".
   */
  readonly reason?: string;

  /**
   * Whether this section is readonly even if the wider context is editable.
   */
  readonly readonly?: boolean;
}

export interface MetadataSectionDiagnostics {
  /**
   * Renderer selected for this section.
   */
  readonly rendererKey?: string;

  /**
   * Renderer version selected for this section.
   */
  readonly rendererVersion?: string;

  /**
   * Optional diagnostics note.
   */
  readonly note?: string;
}

export interface MetadataSectionSlots {
  /**
   * Optional section header override.
   */
  readonly header?: ReactNode;

  /**
   * Optional action area.
   */
  readonly actions?: ReactNode;

  /**
   * Main section content.
   */
  readonly content: ReactNode;

  /**
   * Optional footer content.
   */
  readonly footer?: ReactNode;
}

export interface MetadataSectionProps {
  /**
   * Stable section identity.
   */
  readonly identity: MetadataSectionIdentity;

  /**
   * Governed section type from @afenda/metadata.
   */
  readonly type: SectionType;

  /**
   * Current metadata-ui render context.
   */
  readonly context: MetadataUiRenderContext;

  /**
   * Structured section slots with clear region ownership.
   */
  readonly slots: MetadataSectionSlots;

  /**
   * Section runtime state.
   */
  readonly state?: MetadataSectionState;

  /**
   * Accessibility metadata.
   */
  readonly a11y?: MetadataSectionA11y;

  /**
   * Presentation options owned by metadata-ui.
   */
  readonly presentation?: MetadataSectionPresentation;

  /**
   * Optional diagnostics metadata.
   */
  readonly diagnostics?: MetadataSectionDiagnostics;
}

export type MetadataSpecificSectionProps = Omit<MetadataSectionProps, "type">;
