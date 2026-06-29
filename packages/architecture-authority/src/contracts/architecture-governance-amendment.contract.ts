import type { ArchitectureLayer } from "./package.contract.js";

/** Domain NS §3.2 — consumer export stability taxonomy. */
export const SURFACE_STABILITY_CLASSES = [
  "released",
  "classic",
  "conditional",
  "prohibited",
] as const;

export type SurfaceStabilityClass = (typeof SURFACE_STABILITY_CLASSES)[number];

/** Domain NS §3 — extension domain relative to core platform. */
export const EXTENSION_BOUNDARY_CLASSES = [
  "platform-only",
  "on-stack-extensible",
  "side-by-side-extensible",
  "hybrid-extensible",
] as const;

export type ExtensionBoundaryClass =
  (typeof EXTENSION_BOUNDARY_CLASSES)[number];

/** Backstage-style logical system for impact analysis (Domain NS §3). */
export const ARCHITECTURE_SYSTEM_IDS = [
  "platform-governance",
  "foundation-runtime",
  "erp-application",
  "design-presentation",
  "metadata-ui",
  "integration-tooling",
] as const;

export type ArchitectureSystemId = (typeof ARCHITECTURE_SYSTEM_IDS)[number];

/** TOGAF landscape membership — as-built vs planned (Domain NS §4 target-state). */
export const TARGET_STATE_MEMBERSHIPS = [
  "as-built",
  "planned",
  "retiring",
] as const;

export type TargetStateMembership = (typeof TARGET_STATE_MEMBERSHIPS)[number];

/** Approved decomposition patterns (Domain NS §3 reference pattern). */
export const REFERENCE_PATTERN_IDS = [
  "bridge-module",
  "contracts-only-platform",
  "governance-root",
  "minimal-depends",
  "metadata-projection",
] as const;

export type ReferencePatternId = (typeof REFERENCE_PATTERN_IDS)[number];

export interface SurfaceStabilityEntry {
  readonly notes: string;
  readonly packageName: string;
  readonly primaryExportSurface: string;
  readonly stabilityClass: SurfaceStabilityClass;
}

export interface ExtensionBoundaryEntry {
  readonly boundaryClass: ExtensionBoundaryClass;
  readonly notes: string;
  readonly packageName: string;
  readonly partnerExtensible: boolean;
}

export interface ArchitectureSystemMembershipEntry {
  readonly layer: ArchitectureLayer;
  readonly packageName: string;
  readonly systemId: ArchitectureSystemId;
}

export interface TargetStateEntry {
  readonly membership: TargetStateMembership;
  readonly packageName: string;
  readonly targetNotes: string;
}

export interface GoldenPathCatalogEntry {
  readonly catalogComplete: boolean;
  readonly layer: ArchitectureLayer;
  readonly ownerAuthority: string;
  readonly packageName: string;
  readonly systemId: ArchitectureSystemId;
}

export interface ReferencePatternEntry {
  readonly displayName: string;
  readonly examplePackages: readonly string[];
  readonly patternId: ReferencePatternId;
  readonly whenToUse: string;
}

export interface ConsumerExportAttestationEntry {
  readonly exportKind: "barrel" | "subpath" | "types-only";
  readonly exportPath: string;
  readonly packageName: string;
  readonly stabilityClass: SurfaceStabilityClass;
}

export interface ArchitectureGovernanceAmendmentRegistry {
  readonly consumerExportAttestation: readonly ConsumerExportAttestationEntry[];
  readonly extensionBoundaries: readonly ExtensionBoundaryEntry[];
  readonly fingerprint: string;
  readonly goldenPathCatalog: readonly GoldenPathCatalogEntry[];
  readonly referencePatterns: readonly ReferencePatternEntry[];
  readonly surfaceStability: readonly SurfaceStabilityEntry[];
  readonly systemMembership: readonly ArchitectureSystemMembershipEntry[];
  readonly targetState: readonly TargetStateEntry[];
}
