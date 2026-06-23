import { SURFACE_TYPES } from "./metadata.constants.js";
import type { SurfaceType } from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const SURFACE_CONTRACT_OWNERSHIPS = [
  "surface-definitions",
  "page-surfaces",
  "workspace-surfaces",
  "module-surfaces",
] as const;

export type SurfaceContractOwnership =
  (typeof SURFACE_CONTRACT_OWNERSHIPS)[number];

export const SURFACE_CONTRACT_PROHIBITIONS = [
  "sections",
  "section-definitions",
  "layout-arrangements",
  "renderers",
  "renderer-selection",
  "renderer-implementation",
  "styling",
  "visual-styling",
  "component-styling",
  "design-tokens",
  "ui-implementation",
  "react-components",
  "business-logic",
  "database-access",
  "permission-execution",
] as const;

export type SurfaceContractProhibition =
  (typeof SURFACE_CONTRACT_PROHIBITIONS)[number];

export interface SurfaceContract {
  readonly authority: "surface";

  /**
   * Surface contract owns metadata surface vocabulary only.
   *
   * It defines where metadata appears:
   * - page
   * - workspace
   * - module
   *
   * It must not define sections, layouts, renderers, styling,
   * UI implementation, business behavior, database access, or permissions.
   */
  readonly owns: readonly SurfaceContractOwnership[];

  /**
   * Responsibilities explicitly forbidden from the surface contract.
   */
  readonly prohibits: readonly SurfaceContractProhibition[];

  /**
   * Governed surface types supported by the metadata authority.
   */
  readonly types: readonly SurfaceType[];
  readonly version: typeof METADATA_CONTRACT_VERSION;
}

export const surfaceContract = {
  authority: "surface",
  version: METADATA_CONTRACT_VERSION,

  owns: SURFACE_CONTRACT_OWNERSHIPS,

  types: SURFACE_TYPES,

  prohibits: SURFACE_CONTRACT_PROHIBITIONS,
} as const satisfies SurfaceContract;
