/**
 * PAS-001 §4.1.2 — kernel identity module layout (single source of truth).
 *
 * Governance gate `check:kernel-identity-surface` and runtime tests import these
 * constants so folder layout cannot drift from PAS prose.
 */

export const IDENTITY_MODULE_PAS_SECTION = "4.1.2" as const;

/** Only `index.ts` may live at `packages/kernel/src/identity/` root. */
export const IDENTITY_MODULE_ROOT_BARREL = "index.ts" as const;

/** Approved nested folders under `packages/kernel/src/identity/`. */
export const IDENTITY_MODULE_SUBFOLDERS = [
  "brand",
  "canonical",
  "registry",
  "families",
  "primitives",
  "tenant-human-reference",
  "postgres",
  "wire",
  "governance",
  "__tests__",
] as const;

export type IdentityModuleSubfolder =
  (typeof IDENTITY_MODULE_SUBFOLDERS)[number];

/** Approved contract files under `identity/families/` (PAS §4.1.4 category layout). */
export const IDENTITY_MODULE_FAMILY_FILES = [
  "index.ts",
  "define-enterprise-family.ts",
  "tenant-hierarchy-id.contract.ts",
  "identity-access-id.contract.ts",
  "audit-execution-id.contract.ts",
  "enterprise-hierarchy-id.contract.ts",
  "business-reference-id.contract.ts",
] as const;

export type IdentityModuleFamilyFile =
  (typeof IDENTITY_MODULE_FAMILY_FILES)[number];

/** Approved contract files under `identity/brand/` (PAS §4.1.2 brand utility layout). */
export const IDENTITY_MODULE_BRAND_FILES = [
  "index.ts",
  "brand.contract.ts",
] as const;

export type IdentityModuleBrandFile =
  (typeof IDENTITY_MODULE_BRAND_FILES)[number];

/** Approved files under `identity/primitives/` (PAS §4.1.5 primitive reference layout). */
export const IDENTITY_MODULE_PRIMITIVE_FILES = [
  "index.ts",
  "primitive-brand.contract.ts",
  "primitive-brand.helpers.ts",
  "primitive-reference.registry.ts",
  "locale-code.contract.ts",
  "timezone-id.contract.ts",
  "date-format.contract.ts",
  "number-format.contract.ts",
  "currency-code.contract.ts",
  "country-code.contract.ts",
  "uom-code.contract.ts",
] as const;

export type IdentityModulePrimitiveFile =
  (typeof IDENTITY_MODULE_PRIMITIVE_FILES)[number];

/** Retired flat `contracts/platform-id*` paths — must not reappear (repo-relative). */
export const RETIRED_KERNEL_PLATFORM_ID_PATHS = [
  "packages/kernel/src/contracts/platform-id.contract.ts",
  "packages/kernel/src/contracts/platform-id-registry.contract.ts",
  "packages/kernel/src/contracts/platform-id-boundary.contract.ts",
] as const;

export const IDENTITY_MODULE_LAYOUT_PROHIBITED_PATTERNS = [
  "duplicate platform-id*.ts paths",
  "external ulid npm dependency in kernel",
  "second branding pattern",
  "direct brand.contract.js import outside brand/index.ts barrel",
  "human number generation in Kernel",
  "flat .ts files at identity root (except index.ts)",
  "unapproved identity subfolders",
] as const;

export type IdentityModuleLayoutProhibitedPattern =
  (typeof IDENTITY_MODULE_LAYOUT_PROHIBITED_PATTERNS)[number];

export const IDENTITY_MODULE_LAYOUT_POLICY = {
  pasSection: IDENTITY_MODULE_PAS_SECTION,
  rootBarrel: IDENTITY_MODULE_ROOT_BARREL,
  subfolders: IDENTITY_MODULE_SUBFOLDERS,
  familyContractFiles: IDENTITY_MODULE_FAMILY_FILES,
  brandContractFiles: IDENTITY_MODULE_BRAND_FILES,
  primitiveContractFiles: IDENTITY_MODULE_PRIMITIVE_FILES,
  retiredPlatformIdPaths: RETIRED_KERNEL_PLATFORM_ID_PATHS,
  prohibitedPatterns: IDENTITY_MODULE_LAYOUT_PROHIBITED_PATTERNS,
} as const;

export function isIdentityModuleSubfolder(
  value: string
): value is IdentityModuleSubfolder {
  return (IDENTITY_MODULE_SUBFOLDERS as readonly string[]).includes(value);
}

export function isIdentityModuleFamilyFile(
  value: string
): value is IdentityModuleFamilyFile {
  return (IDENTITY_MODULE_FAMILY_FILES as readonly string[]).includes(value);
}

export function isIdentityModuleBrandFile(
  value: string
): value is IdentityModuleBrandFile {
  return (IDENTITY_MODULE_BRAND_FILES as readonly string[]).includes(value);
}

export function isIdentityModulePrimitiveFile(
  value: string
): value is IdentityModulePrimitiveFile {
  return (IDENTITY_MODULE_PRIMITIVE_FILES as readonly string[]).includes(value);
}
