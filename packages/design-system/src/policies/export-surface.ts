import type { PublicExportContract } from "../contracts/export.contract";

/**
 * Stable public export surface for @afenda/design-system.
 *
 * Only symbols listed in `stableExports` may be consumed by other packages.
 * Internal folders (contracts, examples, policies, recipes, tokens, variants)
 * must never be deep-imported directly — consumers always go through the root
 * entry point.
 *
 * Keep this list sorted alphabetically so the governance test can compare it
 * with Object.keys(publicRuntimeExports).sort() without order ambiguity.
 */
export const publicExportContract = {
  packageName: "@afenda/design-system",
  publicEntrypoints: ["."],
  stableExports: [
    "GOVERNED_STATES",
    "MOTION_INTENTS",
    "PACKAGE_NAME",
    "RADII",
    "SHADOWS",
    "SIZES",
    "SLOT_ROLES",
    "STATUS_TONES",
    "TOKEN_CATEGORIES",
    "VARIANT_AXES",
    "accessibilityPolicy",
    "classNamePolicy",
    "designSystemContract",
    "driftPreventionChecklist",
    "erpGovernedExamples",
    "getPackageName",
    "isPublicDesignSystemImport",
    "motionPolicy",
    "publicExportContract",
    "recipeRegistry",
    "statePolicy",
    "tokenRegistry",
    "validateDesignSystemGovernance",
    "validateLayoutClassName",
    "variantRegistry",
  ],
  deepImportsAllowed: false,
  internalFolders: [
    "contracts",
    "examples",
    "policies",
    "recipes",
    "tokens",
    "variants",
  ],
} as const satisfies PublicExportContract;

export const isPublicDesignSystemImport = (specifier: string): boolean =>
  specifier === "@afenda/design-system";
