import {
  METADATA_DENSITY_MODES,
  PRESENTATION_MODES,
} from "./metadata.constants.js";
import type {
  MetadataDensityMode,
  PresentationMode,
} from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const PRESENTATION_CONTRACT_OWNERSHIPS = [
  "presentation-modes",
  "density-modes",
  "readonly-mode-rules",
  "diagnostic-visibility",
  "visibility-rules",
] as const;

export type PresentationContractOwnership =
  (typeof PRESENTATION_CONTRACT_OWNERSHIPS)[number];

export const PRESENTATION_CONTRACT_PROHIBITIONS = [
  "design-tokens",
  "component-styling",
  "visual-styling",
  "ui-implementation",
  "react-components",
  "renderer-implementation",
  "business-logic",
  "database-access",
  "permission-execution",
] as const;

export type PresentationContractProhibition =
  (typeof PRESENTATION_CONTRACT_PROHIBITIONS)[number];

export interface PresentationContract {
  readonly authority: "presentation";
  readonly version: typeof METADATA_CONTRACT_VERSION;

  /**
   * Presentation contract owns metadata display intent only.
   *
   * It may define modes, density, readonly behavior, diagnostics visibility,
   * and visibility rules. It must not define visual tokens, component styles,
   * React components, or renderer implementation.
   */
  readonly owns: readonly PresentationContractOwnership[];

  /**
   * Governed presentation modes.
   */
  readonly presentationModes: readonly PresentationMode[];

  /**
   * Governed metadata density modes.
   */
  readonly densityModes: readonly MetadataDensityMode[];

  /**
   * Responsibilities explicitly forbidden from the presentation contract.
   */
  readonly prohibits: readonly PresentationContractProhibition[];
}

export const presentationContract = {
  authority: "presentation",
  version: METADATA_CONTRACT_VERSION,

  owns: PRESENTATION_CONTRACT_OWNERSHIPS,

  presentationModes: PRESENTATION_MODES,

  densityModes: METADATA_DENSITY_MODES,

  prohibits: PRESENTATION_CONTRACT_PROHIBITIONS,
} as const satisfies PresentationContract;
