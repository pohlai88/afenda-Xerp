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

// Authority vocabulary
export {
  ACCESSIBILITY_REQUIREMENTS,
  AFENDA_TOKEN_CATEGORIES,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  DESIGN_AUTHORITY_DOMAINS,
  DENSITIES,
  GOVERNED_STATES,
  MOTION_INTENTS,
  PROHIBITED_CLASSNAME_PATTERNS,
  RADII,
  SHADOWS,
  SIZES,
  SLOT_ROLES,
  STATUS_TONES,
  TIP_004_DOWNSTREAM_CONTRACTS,
  TOKEN_CATEGORIES,
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  assertAfendaTokenName,
  isAfendaTokenName,
  tokenNameToCssVariable,
  accessibilityPolicy,
  motionPolicy,
} from "@afenda/design-system";

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
} from "@afenda/design-system";

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
  DesignAuthorityAcceptanceCriteria,
  DesignAuthorityDomain,
  DesignAuthorityIdentity,
  DesignSystemAuthorityContract,
  DesignSystemContract,
  DesignSystemPackageBoundary,
  Density,
  GovernedComponentContract,
  GovernedExample,
  GovernedRadius,
  GovernedShadow,
  GovernedSize,
  GovernedState,
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
  Tip004DownstreamContract,
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
