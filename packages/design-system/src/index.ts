// biome-ignore-all lint/performance/noBarrelFile: TIP-006 requires a stable public root export surface.
import type { DesignSystemContract } from "./contracts/design-system.contract";
import { erpGovernedExamples } from "./examples/erp-patterns";
import { accessibilityPolicy } from "./policies/accessibility";
import { classNamePolicy } from "./policies/class-name-policy";
import { publicExportContract } from "./policies/export-surface";
import { motionPolicy } from "./policies/motion";
import { statePolicy } from "./policies/state";
import { recipeRegistry } from "./recipes/registry";
import { tokenRegistry } from "./tokens/registry";
import { variantRegistry } from "./variants/registry";

export const PACKAGE_NAME = "@afenda/design-system" as const;

export const designSystemContract = {
  packageName: PACKAGE_NAME,
  principle: {
    tokenOwnsValue: true,
    variantOwnsMeaning: true,
    recipeOwnsStyling: true,
    componentOwnsBehavior: true,
    slotOwnsStructure: true,
    classNameOwnsLayoutOnly: true,
    exampleOwnsAiImitation: true,
  },
  tokens: tokenRegistry,
  variants: variantRegistry,
  recipes: recipeRegistry,
  classNamePolicy,
  accessibility: accessibilityPolicy,
  motion: motionPolicy,
  states: statePolicy,
  examples: erpGovernedExamples,
  exports: publicExportContract,
} as const satisfies DesignSystemContract;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  AccessibilityContract,
  AccessibilityRequirement,
} from "./contracts/accessibility.contract";
export type { ClassNamePolicyContract } from "./contracts/class-name-policy.contract";
export type { GovernedComponentContract } from "./contracts/component.contract";
export type { DesignSystemContract } from "./contracts/design-system.contract";
export type { GovernedExample } from "./contracts/example.contract";
export type { PublicExportContract } from "./contracts/export.contract";
export type { MotionContract, MotionIntent } from "./contracts/motion.contract";
export type {
  RecipeDeclaration,
  RecipeDefinition,
  RecipeRegistry,
} from "./contracts/recipe.contract";
export type { SlotContract, SlotRole } from "./contracts/slot.contract";
export type {
  GovernedState,
  StateContract,
  StatePattern,
} from "./contracts/state.contract";
export type {
  Density,
  GovernedRadius,
  GovernedShadow,
  GovernedSize,
  StatusTone,
  TokenCategory,
  TokenDefinition,
  TokenName,
  TokenRegistry,
} from "./contracts/token.contract";
export type {
  VariantAxis,
  VariantDefinition,
  VariantEmphasis,
  VariantIntent,
  VariantRegistry,
  VariantSelection,
} from "./contracts/variant.contract";
export type { ClassNamePolicyResult } from "./policies/class-name-policy";
export type { GovernanceValidationResult } from "./policies/drift-validation";
export type { AfendaTokenName } from "./tokens/registry";

// ─── Runtime constants ────────────────────────────────────────────────────────

export { MOTION_INTENTS } from "./contracts/motion.contract";
export { SLOT_ROLES } from "./contracts/slot.contract";
export { GOVERNED_STATES } from "./contracts/state.contract";
export {
  DENSITIES,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
} from "./contracts/token.contract";
export {
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
} from "./contracts/variant.contract";

// ─── Values ───────────────────────────────────────────────────────────────────

export { erpGovernedExamples } from "./examples/erp-patterns";
export { accessibilityPolicy } from "./policies/accessibility";
export {
  classNamePolicy,
  validateLayoutClassName,
} from "./policies/class-name-policy";
export {
  driftPreventionChecklist,
  validateDesignSystemGovernance,
} from "./policies/drift-validation";
export {
  isPublicDesignSystemImport,
  publicExportContract,
} from "./policies/export-surface";
export { motionPolicy } from "./policies/motion";
export { statePolicy } from "./policies/state";
export { recipeRegistry } from "./recipes/registry";
export { tokenRegistry } from "./tokens/registry";
export { variantRegistry } from "./variants/registry";
