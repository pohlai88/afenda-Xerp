import { SECTION_TYPES } from "./metadata.constants.js";
import type { SectionType } from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const SECTION_CONTRACT_OWNERSHIPS = [
  "section-definitions",
  "list-sections",
  "stat-sections",
  "chart-sections",
  "form-sections",
  "detail-sections",
  "audit-sections",
  "action-sections",
] as const;

export type SectionContractOwnership =
  (typeof SECTION_CONTRACT_OWNERSHIPS)[number];

export const SECTION_CONTRACT_PROHIBITIONS = [
  "layout-arrangements",
  "renderer-selection",
  "renderer-implementation",
  "ui-implementation",
  "react-components",
  "component-styling",
  "design-tokens",
  "business-logic",
  "database-access",
  "permission-execution",
] as const;

export type SectionContractProhibition =
  (typeof SECTION_CONTRACT_PROHIBITIONS)[number];

export interface SectionContract {
  readonly authority: "section";
  readonly version: typeof METADATA_CONTRACT_VERSION;

  /**
   * Section contract owns metadata section vocabulary only.
   *
   * It defines what content-zone kinds exist.
   * It must not decide layout arrangement, renderer selection,
   * renderer implementation, UI implementation, or business behavior.
   */
  readonly owns: readonly SectionContractOwnership[];

  /**
   * Governed section types supported by the metadata authority.
   */
  readonly types: readonly SectionType[];

  /**
   * Responsibilities explicitly forbidden from the section contract.
   */
  readonly prohibits: readonly SectionContractProhibition[];
}

export const sectionContract = {
  authority: "section",
  version: METADATA_CONTRACT_VERSION,

  owns: SECTION_CONTRACT_OWNERSHIPS,

  types: SECTION_TYPES,

  prohibits: SECTION_CONTRACT_PROHIBITIONS,
} as const satisfies SectionContract;
