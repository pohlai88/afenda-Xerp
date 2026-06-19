import { recipeRegistry } from "../recipes/registry";
import { tokenRegistry } from "../tokens/registry";
import { variantRegistry } from "../variants/registry";
import { publicExportContract } from "./export-surface";

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

export const validateDesignSystemGovernance =
  (): GovernanceValidationResult => {
    const tokenNames = new Set(tokenRegistry.tokens.map((token) => token.name));
    const variantAxes = new Set(variantRegistry.axes);
    const errors: string[] = [];

    for (const recipe of recipeRegistry.recipes) {
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
    }

    if (publicExportContract.deepImportsAllowed) {
      errors.push("Deep imports must remain disabled.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };
