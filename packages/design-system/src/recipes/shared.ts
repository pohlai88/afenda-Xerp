import type { RecipeDefinition } from "../contracts/recipe.contract";

export const commonProhibitedOverrides = [
  "raw color classes",
  "raw radius classes",
  "raw shadow classes",
  "raw motion classes",
  "component-specific visual hacks",
] as const satisfies RecipeDefinition["prohibitedOverrides"];
