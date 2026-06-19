import type { PublicExportContract } from "../contracts/export.contract";

export const publicExportContract = {
  packageName: "@afenda/design-system",
  publicEntrypoints: ["."],
  stableExports: [
    "accessibilityPolicy",
    "classNamePolicy",
    "designSystemContract",
    "driftPreventionChecklist",
    "erpGovernedExamples",
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
