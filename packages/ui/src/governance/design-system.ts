/**
 * @afenda/ui design-system bridge.
 *
 * This file is the only allowed direct import surface from
 * @afenda/design-system into @afenda/ui.
 *
 * Do not import this file from applications.
 * Do not import @afenda/design-system directly from components.
 * Do not define tokens, variants, states, recipes, motion, or className policy here.
 *
 * This bridge re-exports governed authority only.
 * Runtime implementation helpers belong in sibling governance modules.
 */

// Governed types
export type {
  AccessibilityContract,
  AccessibilityRequirement,
  AfendaCssVariableName,
  AfendaTokenCategory,
  AfendaTokenCssVariable,
  AfendaTokenName,
  AiAntiDriftRules,
  ClassNamePolicyContract,
  Density,
  DesignAuthorityAcceptanceCriteria,
  DesignAuthorityDomain,
  DesignAuthorityIdentity,
  DesignSystemAuthorityContract,
  DesignSystemContract,
  DesignSystemPackageBoundary,
  GovernedComponentContract,
  GovernedExample,
  GovernedRadius,
  GovernedShadow,
  GovernedSize,
  GovernedState,
  GovernedUiDownstreamContract,
  MotionContract,
  MotionIntent,
  OwnershipDomainAuthority,
  ProhibitedOverlapRule,
  PublicExportContract,
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
  /** @deprecated Prefer {@link AfendaTokenName}. */
  TokenName,
  TokenRegistry,
  VariantAxis,
  VariantDefinition,
  VariantEmphasis,
  VariantIntent,
  VariantRegistry,
  VariantSelection,
} from "@afenda/design-system";
// Authority vocabulary
// Authority contracts
export {
  ACCESSIBILITY_REQUIREMENTS,
  AFENDA_TOKEN_CATEGORIES,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  accessibilityContract,
  accessibilityPolicy,
  assertAfendaTokenName,
  classNamePolicyContract,
  componentContract,
  DENSITIES,
  DENSITY_ATTRIBUTES,
  DESIGN_AUTHORITY_DOMAINS,
  densityAttributeSelector,
  densityContract,
  densityFromAttribute,
  densityToAttribute,
  designSystemAuthorityContract,
  exampleContract,
  exportContract,
  GOVERNED_STATES,
  GOVERNED_UI_DOWNSTREAM_CONTRACTS,
  isAfendaTokenName,
  isDensity,
  isDensityAttribute,
  MOTION_INTENTS,
  motionContract,
  motionPolicy,
  PROHIBITED_CLASSNAME_PATTERNS,
  RADII,
  recipeContract,
  SHADOWS,
  SIZES,
  SLOT_ROLES,
  STATUS_TONES,
  slotContract,
  stateContract,
  TOKEN_CATEGORIES,
  tokenContract,
  tokenNameToCssVariable,
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  variantContract,
} from "@afenda/design-system";
