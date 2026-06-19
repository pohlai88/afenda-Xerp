import { MOTION_INTENTS } from "../contracts/motion.contract";
import type { RecipeDefinition } from "../contracts/recipe.contract";
import { RADII, SHADOWS, STATUS_TONES } from "../contracts/token.contract";
import { recipeRegistry } from "../recipes/registry";
import { tokenRegistry } from "../tokens/registry";
import { variantRegistry } from "../variants/registry";
import { publicExportContract } from "./export-surface";
import { motionPolicy } from "./motion";

export const driftPreventionChecklist = [
  "Use tokens for color, status tone, spacing, radius, shadow, typography, density, and motion values.",
  "Use variants to express visual meaning such as intent, tone, density, size, radius, shadow, and emphasis.",
  "Use recipes for component styling and slots for structure.",
  "Use className for layout only.",
  "Use public imports from @afenda/design-system only.",
  "Represent loading, empty, error, forbidden, invalid, and ready with the state policy.",
  "Preserve semantic elements, focus visibility, labels, live regions, and reduced motion behavior.",
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
      errors.push(`${recipe.name} references unknown variant axis ${axis}`);
    }
  }

  for (const declaration of recipe.declarations) {
    if (!tokenNames.has(declaration.token)) {
      errors.push(
        `${recipe.name} references unknown token ${declaration.token}`
      );
    }
  }

  if (!recipe.slots.some((slot) => slot.role === "root")) {
    errors.push(`${recipe.name} must define a root slot`);
  }

  return errors;
};

/**
 * Verifies that every RADII / SHADOWS value has a concrete token, and that
 * every governed status tone has a surface token.  These checks close the
 * enum–registry gap: adding a new enum value without a token is a governance
 * error that gets caught before any component tries to consume it.
 */
const collectTokenCoverageErrors = (
  tokenNames: ReadonlySet<string>
): string[] => {
  const errors: string[] = [];

  for (const radius of RADII) {
    if (!tokenNames.has(`radius.${radius}`)) {
      errors.push(
        `Token registry is missing radius.${radius} — add it or remove it from the RADII enum.`
      );
    }
  }

  for (const shadow of SHADOWS) {
    if (!tokenNames.has(`shadow.${shadow}`)) {
      errors.push(
        `Token registry is missing shadow.${shadow} — add it or remove it from the SHADOWS enum.`
      );
    }
  }

  for (const tone of STATUS_TONES) {
    if (!tokenNames.has(`statusTone.${tone}.surface`)) {
      errors.push(
        `Token registry is missing statusTone.${tone}.surface — every governed tone requires a surface token.`
      );
    }
  }

  return errors;
};

/**
 * Verifies two things about the motion policy:
 *   1. Coverage — every MOTION_INTENTS value has a corresponding motionPolicy entry.
 *   2. Token existence — each entry's durationToken and easingToken exist in the
 *      token registry, so a component that resolves a motion intent always gets
 *      a concrete CSS value.
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
        `Motion intent "${entry.intent}" references unknown duration token ${entry.durationToken}.`
      );
    }

    if (!tokenNames.has(entry.easingToken)) {
      errors.push(
        `Motion intent "${entry.intent}" references unknown easing token ${entry.easingToken}.`
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
      tokenRegistry.tokens.map((token) => token.name)
    );
    const variantAxes = new Set<string>(variantRegistry.axes);
    const errors: string[] = [];

    for (const recipe of recipeRegistry.recipes) {
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
