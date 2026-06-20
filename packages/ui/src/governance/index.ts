// Authority vocabulary — re-exported from the design-system bridge.
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
} from "./design-system";

// Authority contracts — re-exported from the design-system bridge.
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

// Authority types — re-exported from the design-system bridge.
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
  TokenName,
  TokenRegistry,
  VariantAxis,
  VariantDefinition,
  VariantEmphasis,
  VariantIntent,
  VariantRegistry,
  VariantSelection,
} from "./design-system";

// Governed UI vocabulary.
export type {
  ClassNamePolicyResult,
  ClassNamePolicyViolation,
  GovernedRecipeName,
  GovernedRecipeResult,
  GovernedUiComponentName,
} from "./types";

export {
  GOVERNED_UI_COMPONENTS,
  GOVERNED_UI_RECIPES,
  isGovernedRecipeName,
  isGovernedUiComponentName,
} from "./types";

export {
  GOVERNED_RECIPE_VARIANT_AXES,
  BADGE_VARIANT_AXES,
  BUTTON_VARIANT_AXES,
  CARD_VARIANT_AXES,
  FORM_CONTROL_VARIANT_AXES,
  STATUS_VARIANT_AXES,
  SURFACE_VARIANT_AXES,
  TABLE_VARIANT_AXES,
  getRecipeVariantAxes,
} from "./recipe-coverage";

// Governed component prop surfaces.
export type {
  AfendaBadgeProps,
  AfendaButtonProps,
  AfendaCardProps,
  GovernedBadgeProps,
  GovernedButtonProps,
  GovernedCardProps,
  GovernedCardRadius,
  GovernedCardShadow,
  GovernedFormControlProps,
  GovernedPanelRadius,
  GovernedPanelShadow,
  GovernedStatusProps,
  GovernedSurfaceProps,
  GovernedTableProps,
} from "./component-props";

export {
  GOVERNED_CARD_RADII,
  GOVERNED_CARD_SHADOWS,
  GOVERNED_PANEL_RADII,
  GOVERNED_PANEL_SHADOWS,
  isGovernedCardRadius,
  isGovernedCardShadow,
  isGovernedPanelRadius,
  isGovernedPanelShadow,
} from "./component-props";

// Runtime implementation helpers.
export {
  assertAllowedLayoutClassName,
  assertAllowedLayoutClassNameStrict,
  getClassNamePolicy,
  resolveLayoutClassName,
  validateLayoutClassName,
} from "./class-name";

export {
  assertGovernedState,
  assertGovernedStates,
  getGovernedStates,
  getUnknownGovernedStates,
  isGovernedState,
  resolveGovernedState,
} from "./state";

export {
  assertMotionPolicyCoverageStrict,
  getMissingMotionIntents,
  getMotionIntent,
  getMotionPolicy,
  isMotionIntent,
  resolveMotionIntent,
} from "./motion";

export {
  getAccessibilityPolicy,
  getComponentAccessibilityDefinition,
  getComponentAccessibilityRequirement,
  getRecipeAccessibilityDefinitions,
  hasComponentAccessibilityDefinition,
  type ComponentAccessibilityDefinition,
} from "./accessibility";

export {
  assertSlotContract,
  assertSlotRole,
  getSlotRoles,
  getUnknownSlotRoles,
  isSlotRole,
  resolveSlotRole,
} from "./slot";

export {
  assertGovernedVariantStrict,
  resolveBadgeVariant,
  resolveBadgeVariantStrict,
  resolveButtonVariant,
  resolveButtonVariantStrict,
  resolveCardVariant,
  resolveCardVariantStrict,
  resolveFormControlVariant,
  resolveFormControlVariantStrict,
  resolveGovernedVariant,
  resolveGovernedVariantStrict,
  resolveStatusVariant,
  resolveStatusVariantStrict,
  resolveSurfaceVariant,
  resolveSurfaceVariantStrict,
  resolveTableVariant,
  resolveTableVariantStrict,
  validateGovernedVariant,
  type VariantPolicyResult,
  type VariantPolicyViolation,
} from "./variant";

export {
  resolveBadgeClassName,
  resolveButtonClassName,
  resolveCardClassName,
  resolveFieldOrientationClassName,
  resolveFormControlClassName,
  resolveGovernedRecipe,
  resolveGovernedRecipeClassName,
  resolveStatusClassName,
  resolveSurfaceClassName,
  resolveTableClassName,
} from "./recipe";

export type {
  FieldOrientation,
  GovernedPrimitiveDefinition,
  PrimitiveGovernanceInput,
  PrimitiveGovernanceResult,
} from "./primitive-contract";

export {
  EXPORTED_STOCK_COMPONENTS,
  GOVERNED_COMPONENT_SOURCE_FILES,
  GOVERNED_PRIMITIVE_REGISTRY,
  PRIMARY_UI_EXPORTS,
  STOCK_SHADCN_PENDING,
  assertComponentExportCoverage,
  getPrimitiveDefinition,
  isGovernedPrimitive,
  isGovernedSourceFile,
  isStockPendingSourceFile,
} from "./primitive-registry";

export type { StockShadcnPendingFile } from "./primitive-registry";

export {
  resolvePrimitiveGovernance,
} from "./primitive-governance";

export {
  mapStockButtonProps,
  mapStockButtonSize,
  mapStockButtonVisualToGoverned,
  type StockButtonSize,
  type StockButtonVisual,
} from "./stock-shadcn-compat";
