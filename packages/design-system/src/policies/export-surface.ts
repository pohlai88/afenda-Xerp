import type { PublicExportContract } from "../contracts/export.contract";

/**
 * Stable public export surface for @afenda/design-system.
 *
 * Only symbols listed in `stableExports` may be consumed by other packages.
 * Internal folders (contracts, examples, policies, recipes, tokens, variants)
 * must never be deep-imported directly — consumers always go through the root
 * entry point.
 *
 * Invariant: this list must stay alphabetically sorted (uppercase before
 * lowercase, matching JavaScript's Array.prototype.sort()) so the governance
 * test can compare it with Object.keys(publicRuntimeExports).sort() without
 * order ambiguity.  Current count: 48.
 */
export const publicExportContract = {
  packageName: "@afenda/design-system",
  publicEntrypoints: ["."],
  stableExports: [
    "ACCESSIBILITY_REQUIREMENTS",
    "ALLOWED_LAYOUT_CLASSNAME_PATTERNS",
    "DENSITIES",
    "DESIGN_AUTHORITY_DOMAINS",
    "GOVERNED_STATES",
    "MOTION_INTENTS",
    "PACKAGE_NAME",
    "PROHIBITED_CLASSNAME_PATTERNS",
    "RADII",
    "SHADOWS",
    "SIZES",
    "SLOT_ROLES",
    "STATUS_TONES",
    "TIP_004_DOWNSTREAM_CONTRACTS",
    "TOKEN_CATEGORIES",
    "VARIANT_AXES",
    "VARIANT_EMPHASES",
    "VARIANT_INTENTS",
    "accessibilityContract",
    "accessibilityPolicy",
    "classNamePolicy",
    "classNamePolicyContract",
    "componentContract",
    "designSystemAuthorityContract",
    "designSystemContract",
    "driftPreventionChecklist",
    "erpGovernedExamples",
    "exampleContract",
    "exportContract",
    "getPackageName",
    "isPublicDesignSystemImport",
    "motionContract",
    "motionPolicy",
    "publicExportContract",
    "recipeContract",
    "recipeRegistry",
    "slotContract",
    "stateContract",
    "statePolicy",
    "tokenContract",
    "tokenRegistry",
    "validateDesignSystemGovernance",
    "validateLayoutClassName",
    "variantContract",
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
