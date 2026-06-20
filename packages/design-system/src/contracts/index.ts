// biome-ignore-all lint/performance/noBarrelFile: TIP-003 requires a stable contract export surface.
export type {
  AccessibilityContract,
  AccessibilityRequirement,
} from "./accessibility.contract";
export {
  ACCESSIBILITY_REQUIREMENTS,
  accessibilityContract,
} from "./accessibility.contract";
export type { ClassNamePolicyContract } from "./class-name-policy.contract";
export {
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  classNamePolicyContract,
  PROHIBITED_CLASSNAME_PATTERNS,
} from "./class-name-policy.contract";
export type { GovernedComponentContract } from "./component.contract";
export { componentContract } from "./component.contract";
export type { DesignSystemContract } from "./design-system.contract";
export type {
  AiAntiDriftRules,
  DesignAuthorityAcceptanceCriteria,
  DesignAuthorityDomain,
  DesignAuthorityIdentity,
  DesignSystemAuthorityContract,
  DesignSystemPackageBoundary,
  OwnershipDomainAuthority,
  ProhibitedOverlapRule,
  Tip004DownstreamContract,
} from "./design-system-authority.contract";
export {
  DESIGN_AUTHORITY_DOMAINS,
  designSystemAuthorityContract,
  TIP_004_DOWNSTREAM_CONTRACTS,
} from "./design-system-authority.contract";
export type { GovernedExample } from "./example.contract";
export { exampleContract } from "./example.contract";
export type { PublicExportContract } from "./export.contract";
export { exportContract } from "./export.contract";
export type { MotionContract, MotionIntent } from "./motion.contract";
export { MOTION_INTENTS, motionContract } from "./motion.contract";
export type {
  RecipeDeclaration,
  RecipeDefinition,
  RecipeRegistry,
} from "./recipe.contract";
export { recipeContract } from "./recipe.contract";
export type { SlotContract, SlotRole } from "./slot.contract";
export { SLOT_ROLES, slotContract } from "./slot.contract";
export type {
  GovernedState,
  StateContract,
  StatePattern,
} from "./state.contract";
export { GOVERNED_STATES, stateContract } from "./state.contract";
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
} from "./token.contract";
export {
  DENSITIES,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
  tokenContract,
} from "./token.contract";
export type {
  VariantAxis,
  VariantDefinition,
  VariantEmphasis,
  VariantIntent,
  VariantRegistry,
  VariantSelection,
} from "./variant.contract";
export {
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  variantContract,
} from "./variant.contract";
