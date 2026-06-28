import type { PublicExportContract } from "../contracts/export.contract";

/**
 * Stable public export surface for @afenda/design-system.
 *
 * Only symbols listed in `stableExports` may be consumed by other packages.
 * Internal folders must never be deep-imported — consumers always go through
 * the root entry point.
 *
 * Invariant: this list must stay alphabetically sorted (uppercase before
 * lowercase, matching JavaScript's Array.prototype.sort()) so the governance
 * test can compare it with Object.keys(publicRuntimeExports).sort() without
 * order ambiguity.
 */
export const publicExportContract = {
  packageName: "@afenda/ui/design-authority",
  publicEntrypoints: [".", "./css/tokens.css"],
  stableExports: [
    "ACCESSIBILITY_REQUIREMENTS",
    "AFENDA_ACCESSIBILITY_REGISTRY",
    "AFENDA_ACCESSIBILITY_REQUIREMENTS",
    "AFENDA_CSS_VARIABLES",
    "AFENDA_MOTION_INTENTS",
    "AFENDA_MOTION_REGISTRY",
    "AFENDA_RECIPE_REGISTRY",
    "AFENDA_SEMANTIC_ROLE_REGISTRY",
    "AFENDA_STATE_NAMES",
    "AFENDA_STATE_REGISTRY",
    "AFENDA_TOKEN_CATEGORIES",
    "AFENDA_TOKEN_NAMES",
    "AFENDA_TOKEN_REGISTRY",
    "AFENDA_VARIANT_AXES",
    "AFENDA_VARIANT_OPTIONS",
    "AFENDA_VARIANT_REGISTRY",
    "AI_GENERATION_RULES",
    "ALLOWED_LAYOUT_CLASSNAME_PATTERNS",
    "DENSITIES",
    "DENSITY_ATTRIBUTES",
    "DESIGN_AUTHORITY_DOMAINS",
    "GOVERNED_STATES",
    "GOVERNED_UI_DOWNSTREAM_CONTRACTS",
    "MOTION_INTENTS",
    "PACKAGE_NAME",
    "PROHIBITED_CLASSNAME_PATTERNS",
    "RADII",
    "SHADOWS",
    "SIZES",
    "SLOT_ROLES",
    "STATUS_TONES",
    "TOKEN_CATEGORIES",
    "VARIANT_AXES",
    "VARIANT_EMPHASES",
    "VARIANT_INTENTS",
    "accessibilityContract",
    "accessibilityPolicy",
    "appShellRecipe",
    "assertAfendaCssVariable",
    "assertAfendaTokenName",
    "classNamePolicy",
    "classNamePolicyContract",
    "componentContract",
    "cssVariablePolicy",
    "densityAttributeSelector",
    "densityContract",
    "densityFromAttribute",
    "densityToAttribute",
    "designSystemAuthorityContract",
    "designSystemContract",
    "designTokenPolicy",
    "driftPreventionChecklist",
    "erpGovernedExamples",
    "exampleContract",
    "exportContract",
    "extractTokenCategory",
    "getPackageName",
    "isAfendaCssVariable",
    "isAfendaTokenName",
    "isDensity",
    "isDensityAttribute",
    "isPublicDesignSystemImport",
    "metadataUiRecipe",
    "motionContract",
    "motionPolicy",
    "publicExportContract",
    "recipeContract",
    "recipeRegistry",
    "slotContract",
    "stateContract",
    "statePolicy",
    "tokenContract",
    "tokenNamePolicy",
    "tokenNameToCssVariable",
    "tokenRegistry",
    "validateClassNames",
    "validateDesignSystemGovernance",
    "validateExportSurface",
    "validateLayoutClassName",
    "validateMotionRegistry",
    "validateRecipeRegistry",
    "validateStateRegistry",
    "validateTokenName",
    "validateTokenRegistry",
    "validateVariantRegistry",
    "variantContract",
    "variantRegistry",
    "visualDriftPolicy",
  ],
  deepImportsAllowed: false,
  internalFolders: [
    "contracts",
    "css",
    "examples",
    "policies",
    "policy",
    "recipes",
    "registries",
    "scripts",
    "tokens",
    "validation",
    "variants",
  ],
} as const satisfies PublicExportContract;

const PUBLIC_ENTRYPOINTS = new Set<string>(
  publicExportContract.publicEntrypoints.map((entrypoint) =>
    entrypoint === "."
      ? "@afenda/ui/design-authority"
      : `@afenda/ui/design-authority${entrypoint.slice(1)}`
  )
);

export const isPublicDesignSystemImport = (specifier: string): boolean =>
  PUBLIC_ENTRYPOINTS.has(specifier);
