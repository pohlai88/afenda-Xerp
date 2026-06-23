import { LAYOUT_TYPES } from "./metadata.constants.js";
import type { LayoutType } from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const LAYOUT_CONTRACT_OWNERSHIPS = [
  "layout-arrangements",
  "dashboard-layouts",
  "grid-layouts",
  "panel-layouts",
  "stack-layouts",
  "tabs-layouts",
  "wizard-layouts",
] as const;

export type LayoutContractOwnership =
  (typeof LAYOUT_CONTRACT_OWNERSHIPS)[number];

export const LAYOUT_CONTRACT_PROHIBITIONS = [
  "visual-styling",
  "renderer-behavior",
  "ui-components",
  "business-rules",
  "permission-logic",
  "database-access",
] as const;

export type LayoutContractProhibition =
  (typeof LAYOUT_CONTRACT_PROHIBITIONS)[number];

export interface LayoutContract {
  readonly authority: "layout";

  /**
   * Layout contract owns structural arrangement vocabulary only.
   *
   * It defines what layout kinds exist, not how they look or render.
   */
  readonly owns: readonly LayoutContractOwnership[];

  /**
   * Responsibilities explicitly forbidden from the layout contract.
   */
  readonly prohibits: readonly LayoutContractProhibition[];

  /**
   * Canonical layout types supported by the metadata authority.
   */
  readonly types: readonly LayoutType[];
  readonly version: typeof METADATA_CONTRACT_VERSION;
}

export const layoutContract = {
  authority: "layout",
  version: METADATA_CONTRACT_VERSION,

  owns: LAYOUT_CONTRACT_OWNERSHIPS,

  types: LAYOUT_TYPES,

  prohibits: LAYOUT_CONTRACT_PROHIBITIONS,
} as const satisfies LayoutContract;
