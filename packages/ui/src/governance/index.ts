// Authority vocabulary
export {
  ACCESSIBILITY_REQUIREMENTS,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  DENSITIES,
  GOVERNED_STATES,
  MOTION_INTENTS,
  PROHIBITED_CLASSNAME_PATTERNS,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
} from "./design-system";

// Authority contracts
export {
  accessibilityContract,
  classNamePolicyContract,
  componentContract,
  designSystemAuthorityContract,
  exampleContract,
  exportContract,
  motionContract,
  recipeContract,
  slotContract,
  stateContract,
  tokenContract,
  variantContract,
} from "./design-system";

// Governed types
export type {
  AccessibilityContract,
  AccessibilityRequirement,
  ClassNamePolicyContract,
  Density,
  GovernedComponentContract,
  GovernedRadius,
  GovernedShadow,
  GovernedSize,
  GovernedState,
  MotionContract,
  MotionIntent,
  RecipeDeclaration,
  RecipeDefinition,
  RecipeRegistry,
  SlotContract,
  SlotRole,
  StateContract,
  StatePattern,
  StatusTone,
  TokenCategory,
  TokenDefinition,
  TokenName,
  TokenRegistry,
  VariantAxis,
  VariantDefinition,
  VariantEmphasis,
  VariantIntent,
  VariantRegistry,
  VariantSelection,
} from "./design-system";

// Runtime implementation helpers
export {
  assertAllowedLayoutClassName,
  getClassNamePolicy,
  resolveLayoutClassName,
} from "./class-name";
export { assertGovernedState, isGovernedState, resolveGovernedState } from "./state";
export { getMotionIntent, getMotionPolicy } from "./motion";
export {
  getAccessibilityPolicy,
  getComponentAccessibilityDefinition,
  getComponentAccessibilityRequirement,
  type ComponentAccessibilityDefinition,
  type GovernedUiComponentName,
} from "./accessibility";
export {
  BADGE_VARIANT_AXES,
  BUTTON_VARIANT_AXES,
  CARD_VARIANT_AXES,
  resolveBadgeVariant,
  resolveButtonVariant,
  resolveCardVariant,
  resolveGovernedVariant,
} from "./variant";
export {
  GOVERNED_UI_RECIPES,
  resolveBadgeClassName,
  resolveButtonClassName,
  resolveCardClassName,
  resolveGovernedRecipe,
  type GovernedRecipeName,
  type GovernedRecipeResult,
} from "./recipe";
