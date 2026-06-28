// biome-ignore-all lint/performance/noBarrelFile: Foundation phase 03/Foundation phase 04 require a stable public root export surface governed by publicExportContract.
import type { DesignSystemContract } from "./contracts/design-system.contract";
import { erpGovernedExamples } from "./examples/erp-patterns";
import { accessibilityPolicy } from "./policies/accessibility";
import { classNamePolicy } from "./policies/class-name-policy";
import { publicExportContract } from "./policies/export-surface";
import { motionPolicy } from "./policies/motion";
import { statePolicy } from "./policies/state";
import { AFENDA_RECIPE_REGISTRY } from "./registries/recipe.registry";
import { AFENDA_TOKEN_REGISTRY } from "./registries/token.registry";
import { AFENDA_VARIANT_REGISTRY } from "./registries/variant.registry";

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
  tokens: AFENDA_TOKEN_REGISTRY,
  variants: AFENDA_VARIANT_REGISTRY,
  recipes: AFENDA_RECIPE_REGISTRY,
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
export type {
  AiAntiDriftRules,
  DesignAuthorityAcceptanceCriteria,
  DesignAuthorityDomain,
  DesignAuthorityIdentity,
  DesignSystemAuthorityContract,
  DesignSystemPackageBoundary,
  GovernedUiDownstreamContract,
  OwnershipDomainAuthority,
  ProhibitedOverlapRule,
} from "./contracts/design-system-authority.contract";
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
  AfendaCssVariableName,
  AfendaTokenCategory,
  AfendaTokenName,
  Density,
  DensityAttribute,
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
export type { AiGenerationRuleSet } from "./policies/ai-generation-policy";
export type { ClassNamePolicyResult } from "./policies/class-name-policy";
export type { DesignTokenPolicy } from "./policies/design-token-policy";
export type { GovernanceValidationResult } from "./policies/drift-validation";
export type { TokenNameValidationResult } from "./policies/token-name-policy";
export type { VisualDriftPolicy } from "./policies/visual-drift-policy";
export type { AfendaAccessibilityRegistry } from "./registries/accessibility.registry";
export type { AfendaSemanticRoleRegistry } from "./registries/semantic-role.registry";
export type { ValidationResult } from "./validation/index";

// ─── Runtime constants ────────────────────────────────────────────────────────

export {
  ACCESSIBILITY_REQUIREMENTS,
  accessibilityContract,
} from "./contracts/accessibility.contract";
export {
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  classNamePolicyContract,
  PROHIBITED_CLASSNAME_PATTERNS,
} from "./contracts/class-name-policy.contract";
export { componentContract } from "./contracts/component.contract";
export {
  densityAttributeSelector,
  densityContract,
  densityFromAttribute,
  densityToAttribute,
  isDensity,
  isDensityAttribute,
} from "./contracts/density.contract";
export {
  DESIGN_AUTHORITY_DOMAINS,
  designSystemAuthorityContract,
  GOVERNED_UI_DOWNSTREAM_CONTRACTS,
} from "./contracts/design-system-authority.contract";
export { exampleContract } from "./contracts/example.contract";
export { exportContract } from "./contracts/export.contract";
export { MOTION_INTENTS, motionContract } from "./contracts/motion.contract";
export { recipeContract } from "./contracts/recipe.contract";
export { SLOT_ROLES, slotContract } from "./contracts/slot.contract";
export { GOVERNED_STATES, stateContract } from "./contracts/state.contract";
export {
  AFENDA_TOKEN_CATEGORIES,
  assertAfendaTokenName,
  DENSITIES,
  DENSITY_ATTRIBUTES,
  isAfendaTokenName,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
  tokenContract,
  tokenNameToCssVariable,
} from "./contracts/token.contract";
export {
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  variantContract,
} from "./contracts/variant.contract";

// ─── CSS helper (re-export from contract for backward compat) ─────────────────

export type { AfendaTokenCssVariable } from "./css/token-css-variable";

// ─── Registries ───────────────────────────────────────────────────────────────

export {
  AFENDA_ACCESSIBILITY_REGISTRY,
  AFENDA_ACCESSIBILITY_REQUIREMENTS,
} from "./registries/accessibility.registry";
export {
  AFENDA_MOTION_INTENTS,
  AFENDA_MOTION_REGISTRY,
} from "./registries/motion.registry";
export {
  AFENDA_RECIPE_REGISTRY,
  recipeRegistry,
} from "./registries/recipe.registry";
export { AFENDA_SEMANTIC_ROLE_REGISTRY } from "./registries/semantic-role.registry";
export {
  AFENDA_STATE_NAMES,
  AFENDA_STATE_REGISTRY,
} from "./registries/state.registry";
export {
  AFENDA_CSS_VARIABLES,
  AFENDA_TOKEN_NAMES,
  AFENDA_TOKEN_REGISTRY,
  tokenRegistry,
} from "./registries/token.registry";
export {
  AFENDA_VARIANT_AXES,
  AFENDA_VARIANT_OPTIONS,
  AFENDA_VARIANT_REGISTRY,
  variantRegistry,
} from "./registries/variant.registry";

// ─── Policies ─────────────────────────────────────────────────────────────────

export { accessibilityPolicy } from "./policies/accessibility";
export { AI_GENERATION_RULES } from "./policies/ai-generation-policy";
export {
  classNamePolicy,
  validateLayoutClassName,
} from "./policies/class-name-policy";
export {
  assertAfendaCssVariable,
  cssVariablePolicy,
  isAfendaCssVariable,
} from "./policies/css-variable-policy";
export { designTokenPolicy } from "./policies/design-token-policy";
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
export {
  extractTokenCategory,
  tokenNamePolicy,
  validateTokenName,
} from "./policies/token-name-policy";
export { visualDriftPolicy } from "./policies/visual-drift-policy";

// ─── Validation layer ─────────────────────────────────────────────────────────

export { validateClassNames } from "./validation/class-name.validation";
export { validateExportSurface } from "./validation/export.validation";
export { validateMotionRegistry } from "./validation/motion.validation";
export { validateRecipeRegistry } from "./validation/recipe.validation";
export { validateStateRegistry } from "./validation/state.validation";
export { validateTokenRegistry } from "./validation/token.validation";
export { validateVariantRegistry } from "./validation/variant.validation";

// ─── Examples ─────────────────────────────────────────────────────────────────

export { erpGovernedExamples } from "./examples/erp-patterns";
export { appShellRecipe, metadataUiRecipe } from "./recipes/index";
