/**
 * PAS-002 §6.1 / §6.2 / §6.3 — architecture-authority package structure and export registry.
 *
 * Single source for filesystem acceptance tests and skill reference alignment.
 */

export const ARCHITECTURE_AUTHORITY_PACKAGE_PAS_SECTIONS = {
  current: "6.1",
  structure: "6.2",
  exports: "6.3",
} as const;

/** Only `index.ts` may live at `packages/architecture-authority/src/` root. */
export const ARCHITECTURE_AUTHORITY_SRC_ROOT_BARREL = "index.ts" as const;

/** Approved top-level folders under `packages/architecture-authority/src/` (PAS §6.1). */
export const ARCHITECTURE_AUTHORITY_CURRENT_SRC_TOP_LEVEL = [
  "contracts",
  "data",
  "validators",
  "surface",
  "workspace",
  "reports",
  "__tests__",
] as const;

export type ArchitectureAuthorityCurrentSrcTopLevel =
  (typeof ARCHITECTURE_AUTHORITY_CURRENT_SRC_TOP_LEVEL)[number];

/** Repo-relative paths that must exist after PAS-002 §6 delivery (Slice B9). */
export const ARCHITECTURE_AUTHORITY_PACKAGE_TARGET_PATHS = [
  "packages/architecture-authority/PAS-002-ARCHITECTURE-AUTHORITY-STANDARD.md",
  "packages/architecture-authority/src/contracts/architecture-authority-version.ts",
  "packages/architecture-authority/src/data/package-registry.data.ts",
  "packages/architecture-authority/src/data/layer-registry.data.ts",
  "packages/architecture-authority/src/data/ownership-registry.data.ts",
  "packages/architecture-authority/src/data/dependency-registry.data.ts",
  "packages/architecture-authority/src/data/lifecycle-registry.data.ts",
  "packages/architecture-authority/src/data/exception-registry.data.ts",
  "packages/architecture-authority/src/data/foundation-disposition.registry.ts",
  "packages/architecture-authority/src/data/business-master-data-authority.registry.ts",
  "packages/architecture-authority/src/validators/validate-architecture.ts",
  "packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts",
  "packages/architecture-authority/src/surface/index.ts",
  "packages/architecture-authority/src/workspace/discover-workspaces.ts",
] as const;

export type ArchitectureAuthorityPackageTargetPath =
  (typeof ARCHITECTURE_AUTHORITY_PACKAGE_TARGET_PATHS)[number];

/** Paths that must never be added under architecture-authority (PAS §6.3). */
export const ARCHITECTURE_AUTHORITY_PACKAGE_PROHIBITED_PATHS = [
  "packages/architecture-authority/src/app",
  "packages/architecture-authority/src/components",
  "packages/architecture-authority/src/routes",
  "packages/architecture-authority/src/server",
  "packages/architecture-authority/src/db",
  "packages/architecture-authority/src/business",
  "packages/architecture-authority/src/hrm",
  "packages/architecture-authority/src/crm",
  "packages/architecture-authority/src/inventory",
  "packages/architecture-authority/src/accounting",
] as const;

export type ArchitectureAuthorityPackageProhibitedPath =
  (typeof ARCHITECTURE_AUTHORITY_PACKAGE_PROHIBITED_PATHS)[number];

/** Registered package.json subpath exports (PAS §6.2). Root `.` is implicit. */
export const ARCHITECTURE_AUTHORITY_SUBPATH_EXPORTS = ["./surface"] as const;

export type ArchitectureAuthoritySubpathExport =
  (typeof ARCHITECTURE_AUTHORITY_SUBPATH_EXPORTS)[number];

export const ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_PROHIBITED_PATTERNS = [
  "runtime feature folders under src/app, src/routes, src/db",
  "business module folders under src/hrm, src/crm, src/inventory, src/accounting",
  "unregistered package.json subpath export",
  "deep consumer import from @afenda/architecture-authority/src",
] as const;

export type ArchitectureAuthorityPackageLayoutProhibitedPattern =
  (typeof ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_PROHIBITED_PATTERNS)[number];

export const ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_POLICY = {
  pasSections: ARCHITECTURE_AUTHORITY_PACKAGE_PAS_SECTIONS,
  srcRootBarrel: ARCHITECTURE_AUTHORITY_SRC_ROOT_BARREL,
  currentSrcTopLevel: ARCHITECTURE_AUTHORITY_CURRENT_SRC_TOP_LEVEL,
  targetPaths: ARCHITECTURE_AUTHORITY_PACKAGE_TARGET_PATHS,
  prohibitedPaths: ARCHITECTURE_AUTHORITY_PACKAGE_PROHIBITED_PATHS,
  subpathExports: ARCHITECTURE_AUTHORITY_SUBPATH_EXPORTS,
  prohibitedPatterns: ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_PROHIBITED_PATTERNS,
} as const satisfies {
  readonly pasSections: typeof ARCHITECTURE_AUTHORITY_PACKAGE_PAS_SECTIONS;
  readonly srcRootBarrel: typeof ARCHITECTURE_AUTHORITY_SRC_ROOT_BARREL;
  readonly currentSrcTopLevel: readonly ArchitectureAuthorityCurrentSrcTopLevel[];
  readonly targetPaths: readonly ArchitectureAuthorityPackageTargetPath[];
  readonly prohibitedPaths: readonly ArchitectureAuthorityPackageProhibitedPath[];
  readonly subpathExports: readonly ArchitectureAuthoritySubpathExport[];
  readonly prohibitedPatterns: readonly ArchitectureAuthorityPackageLayoutProhibitedPattern[];
};

export function isArchitectureAuthorityCurrentSrcTopLevel(
  value: string
): value is ArchitectureAuthorityCurrentSrcTopLevel {
  return (
    ARCHITECTURE_AUTHORITY_CURRENT_SRC_TOP_LEVEL as readonly string[]
  ).includes(value);
}

export function isArchitectureAuthoritySubpathExport(
  value: string
): value is ArchitectureAuthoritySubpathExport {
  return (ARCHITECTURE_AUTHORITY_SUBPATH_EXPORTS as readonly string[]).includes(
    value
  );
}
