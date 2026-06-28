/**
 * Default section renderer contracts.
 *
 * Authority:
 * - Defines governed configuration for metadata-ui section renderers.
 * - Consumes SectionType from @afenda/ui-composition — does not redefine vocabulary.
 */

import type { SectionType } from "@afenda/ui-composition";
import type { ComponentType } from "react";

import type { MetadataSectionProps } from "../contracts/section.contract.js";

export const DEFAULT_SECTION_RENDERER_VERSION = "0.1.0" as const;

export const DEFAULT_SECTION_RENDERER_OWNER_PACKAGE =
  "@afenda/metadata-ui" as const;

export type MetadataSectionRendererComponent = ComponentType<
  Omit<MetadataSectionProps, "type">
>;

export interface CreateSectionRendererInput {
  readonly defaultIdentity: {
    readonly id: string;
    readonly title: string;
  };
  readonly label: string;
  readonly SectionComponent: MetadataSectionRendererComponent;
  readonly sectionType: SectionType;
}

export interface SectionRendererSpec extends CreateSectionRendererInput {
  readonly exportName: string;
}
