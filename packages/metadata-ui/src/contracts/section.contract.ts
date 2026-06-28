/**
 * Metadata section contracts.
 *
 * Authority:
 * - Defines section props for metadata-ui composition.
 * - Consumes SectionType from @afenda/ui-composition — does not redefine section vocabulary.
 */

import type { SectionType } from "@afenda/ui-composition";
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
   * Optional description shown below title or used in diagnostics.
   */
  readonly description?: string;
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
}

export interface MetadataSectionA11y {
  /**
   * ID of the element that describes the section.
   */
  readonly ariaDescribedBy?: string;
  /**
   * Accessible label for the section region.
   */
  readonly ariaLabel?: string;

  /**
   * ID of the element that labels the section.
   */
  readonly ariaLabelledBy?: string;
}

export interface MetadataSectionPresentation {
  /**
   * How much visual chrome the section renderer should apply.
   */
  readonly chrome?: MetadataSectionChromeMode;

  /**
   * Optional governed class name from metadata-ui renderer boundary.
   */
  readonly className?: string;

  /**
   * Whether the section should render internal spacing.
   */
  readonly padded?: boolean;
}

export interface MetadataSectionState {
  /**
   * Whether this section is readonly even if the wider context is editable.
   */
  readonly readonly?: boolean;

  /**
   * Reason shown in diagnostics or disabled/hidden UI.
   *
   * Required by convention when visibility is not "visible".
   */
  readonly reason?: string;
  /**
   * Section visibility state. Prefer this over separate hidden/disabled booleans.
   */
  readonly visibility: MetadataSectionVisibilityState;
}

export interface MetadataSectionDiagnostics {
  /**
   * Optional diagnostics note.
   */
  readonly note?: string;
  /**
   * Renderer selected for this section.
   */
  readonly rendererKey?: string;

  /**
   * Renderer version selected for this section.
   */
  readonly rendererVersion?: string;
}

export interface MetadataSectionSlots {
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
  /**
   * Optional section header override.
   */
  readonly header?: ReactNode;
}

export interface MetadataSectionProps {
  /**
   * Accessibility metadata.
   */
  readonly a11y?: MetadataSectionA11y;

  /**
   * Current metadata-ui render context.
   */
  readonly context: MetadataUiRenderContext;

  /**
   * Optional diagnostics metadata.
   */
  readonly diagnostics?: MetadataSectionDiagnostics;
  /**
   * Stable section identity.
   */
  readonly identity: MetadataSectionIdentity;

  /**
   * Presentation options owned by metadata-ui.
   */
  readonly presentation?: MetadataSectionPresentation;

  /**
   * Structured section slots with clear region ownership.
   */
  readonly slots: MetadataSectionSlots;

  /**
   * Section runtime state.
   */
  readonly state?: MetadataSectionState;

  /**
   * Governed section type from @afenda/ui-composition.
   */
  readonly type: SectionType;
}

export type MetadataSpecificSectionProps = Omit<MetadataSectionProps, "type">;
