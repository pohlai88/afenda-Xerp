import { MOTION_INTENTS } from "../contracts/motion.contract";
import type { RecipeDefinition } from "../contracts/recipe.contract";
import { RADII, SHADOWS, STATUS_TONES } from "../contracts/token.contract";
import { AFENDA_RECIPE_REGISTRY } from "../registries/recipe.registry";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";
import { AFENDA_VARIANT_REGISTRY } from "../registries/variant.registry";
import { publicExportContract } from "./export-surface";
import { motionPolicy } from "./motion";

export const driftPreventionChecklist = [
  "Use afenda.* tokens for color, status tone, spacing, radius, shadow, typography, density, and motion values.",
  "Use variants to express visual meaning such as intent, tone, density, size, radius, shadow, and emphasis.",
  "Use recipes for component styling and slots for structure.",
  "Use className for layout only.",
  "Use public imports from @afenda/design-system only.",
  "Represent loading, empty, error, forbidden, invalid, and ready with the state policy.",
  "Preserve semantic elements, focus visibility, labels, live regions, and reduced motion behavior.",
  "All token names must start with afenda. — never use unprefixed token names.",
  "All CSS variables must start with --afenda- — never use --token- or other prefixes.",
] as const;

export interface GovernanceValidationResult {
  readonly errors: readonly string[];
  readonly valid: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const collectRecipeGovernanceErrors = (
  recipe: RecipeDefinition,
  tokenNames: ReadonlySet<string>,
  variantAxes: ReadonlySet<string>
): string[] => {
  const errors: string[] = [];

  for (const axis of recipe.variantAxes) {
    if (!variantAxes.has(axis)) {
      errors.push(`${recipe.name} references unknown variant axis "${axis}"`);
    }
  }

  for (const declaration of recipe.declarations) {
    if (!tokenNames.has(declaration.token)) {
      errors.push(
        `${recipe.name} references unknown token "${declaration.token}"`
      );
    }
  }

  if (!recipe.slots.some((slot) => slot.role === "root")) {
    errors.push(`${recipe.name} must define a root slot`);
  }

  return errors;
};

/**
 * Verifies every RADII / SHADOWS value has a concrete `afenda.*` token,
 * and every governed status tone has a surface token.
 * This closes the enum–registry gap: adding a new enum value without a
 * matching token is caught before any component tries to consume it.
 */
const collectTokenCoverageErrors = (
  tokenNames: ReadonlySet<string>
): string[] => {
  const errors: string[] = [];

  for (const radius of RADII) {
    if (!tokenNames.has(`afenda.radius.${radius}`)) {
      errors.push(
        `Token registry missing afenda.radius.${radius} — add it or remove it from RADII.`
      );
    }
  }

  for (const shadow of SHADOWS) {
    if (!tokenNames.has(`afenda.shadow.${shadow}`)) {
      errors.push(
        `Token registry missing afenda.shadow.${shadow} — add it or remove it from SHADOWS.`
      );
    }
  }

  for (const tone of STATUS_TONES) {
    if (!tokenNames.has(`afenda.status-tone.${tone}.surface`)) {
      errors.push(
        `Token registry missing afenda.status-tone.${tone}.surface — every governed tone requires a surface token.`
      );
    }
  }

  return errors;
};

const collectTokenPrefixErrors = (
  tokenNames: ReadonlySet<string>
): string[] => {
  const errors: string[] = [];
  for (const name of tokenNames) {
    if (!name.startsWith("afenda.")) {
      errors.push(
        `Token name "${name}" lacks the required afenda. prefix. All tokens must start with afenda.`
      );
    }
  }
  return errors;
};

/**
 * Verifies:
 *   1. Coverage — every MOTION_INTENTS value has a motionPolicy entry.
 *   2. Token existence — each entry's durationToken and easingToken are in the registry.
 */
const collectMotionCoverageErrors = (
  tokenNames: ReadonlySet<string>
): string[] => {
  const errors: string[] = [];
  const coveredIntents = new Set<string>();

  for (const entry of motionPolicy) {
    coveredIntents.add(entry.intent);

    if (!tokenNames.has(entry.durationToken)) {
      errors.push(
        `Motion intent "${entry.intent}" references unknown duration token "${entry.durationToken}".`
      );
    }

    if (!tokenNames.has(entry.easingToken)) {
      errors.push(
        `Motion intent "${entry.intent}" references unknown easing token "${entry.easingToken}".`
      );
    }
  }

  for (const intent of MOTION_INTENTS) {
    if (!coveredIntents.has(intent)) {
      errors.push(
        `Motion intent "${intent}" has no motionPolicy entry — add it to policies/motion.ts.`
      );
    }
  }

  return errors;
};

// ─── Public validator ─────────────────────────────────────────────────────────

export const validateDesignSystemGovernance =
  (): GovernanceValidationResult => {
    const tokenNames = new Set<string>(
      AFENDA_TOKEN_REGISTRY.tokens.map((token) => token.name)
    );
    const variantAxes = new Set<string>(AFENDA_VARIANT_REGISTRY.axes);
    const errors: string[] = [];

    errors.push(...collectTokenPrefixErrors(tokenNames));

    for (const recipe of AFENDA_RECIPE_REGISTRY.recipes) {
      errors.push(
        ...collectRecipeGovernanceErrors(recipe, tokenNames, variantAxes)
      );
    }

    if (publicExportContract.deepImportsAllowed) {
      errors.push("Deep imports must remain disabled.");
    }

    errors.push(...collectTokenCoverageErrors(tokenNames));
    errors.push(...collectMotionCoverageErrors(tokenNames));

    return {
      valid: errors.length === 0,
      errors,
    };
  };
