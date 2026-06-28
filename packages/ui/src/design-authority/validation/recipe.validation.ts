import { VARIANT_AXES } from "../contracts/variant.contract";
import { AFENDA_RECIPE_REGISTRY } from "../registries/recipe.registry";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";
import type { ValidationResult } from "./index";

// Tailwind semantic class prefixes that recipes must never contain.
const TAILWIND_SEMANTIC_PREFIXES = [
  "bg-",
  "text-",
  "border-",
  "shadow",
  "rounded",
  "ring-",
  "animate-",
  "duration-",
  "ease-",
  "opacity-",
];

export function validateRecipeRegistry(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const tokenNames = new Set<string>(
    AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
  );
  const governedAxes = new Set<string>(VARIANT_AXES);

  for (const recipe of AFENDA_RECIPE_REGISTRY.recipes) {
    // Must define a root slot
    const hasRoot = recipe.slots.some((s) => s.role === "root");
    results.push({
      rule: `recipe.${recipe.name}.has-root-slot`,
      passed: hasRoot,
      detail: hasRoot
        ? undefined
        : `Recipe "${recipe.name}" must define a root slot`,
    });

    // Every declaration token must be in the registry
    for (const decl of recipe.declarations) {
      const tokenExists = tokenNames.has(decl.token);
      results.push({
        rule: `recipe.${recipe.name}.token.exists: ${decl.token}`,
        passed: tokenExists,
        detail: tokenExists
          ? undefined
          : `Recipe "${recipe.name}" references unknown token "${decl.token}"`,
      });

      // Token must be afenda-prefixed
      const afendaPrefixed = decl.token.startsWith("afenda.");
      results.push({
        rule: `recipe.${recipe.name}.token.prefix: ${decl.token}`,
        passed: afendaPrefixed,
        detail: afendaPrefixed
          ? undefined
          : `Recipe "${recipe.name}" token "${decl.token}" lacks required afenda. prefix`,
      });

      // Token must not be a Tailwind class
      const isTailwindClass = TAILWIND_SEMANTIC_PREFIXES.some((p) =>
        decl.token.startsWith(p)
      );
      results.push({
        rule: `recipe.${recipe.name}.token.not-tailwind: ${decl.token}`,
        passed: !isTailwindClass,
        detail: isTailwindClass
          ? `Recipe "${recipe.name}" token "${decl.token}" looks like a Tailwind class`
          : undefined,
      });
    }

    // Every variant axis must be governed
    for (const axis of recipe.variantAxes) {
      const validAxis = governedAxes.has(axis);
      results.push({
        rule: `recipe.${recipe.name}.variantAxis.governed: ${axis}`,
        passed: validAxis,
        detail: validAxis
          ? undefined
          : `Recipe "${recipe.name}" references unknown variant axis "${axis}"`,
      });
    }
  }

  return results;
}
