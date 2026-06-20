import type { VariantAxis } from "./design-system";
import type { GovernedRecipeName } from "./types";

/**
 * Governed variant axes per recipe — must stay aligned with
 * `@afenda/design-system` `AFENDA_RECIPE_REGISTRY`.
 */
export const GOVERNED_RECIPE_VARIANT_AXES = {
  button: ["intent", "density", "size", "radius", "emphasis"],
  badge: ["tone", "density", "size", "radius", "emphasis"],
  card: ["density", "radius", "shadow"],
  surface: ["density", "radius", "shadow"],
  status: ["tone", "density", "radius"],
  // Status CVA applies emphasis internally via defaultVariants; not a public axis per AFENDA_RECIPE_REGISTRY.
  "form-control": ["density", "size"],
  table: ["density", "size"],
} as const satisfies Record<GovernedRecipeName, readonly VariantAxis[]>;

export const BUTTON_VARIANT_AXES = GOVERNED_RECIPE_VARIANT_AXES.button;
export const BADGE_VARIANT_AXES = GOVERNED_RECIPE_VARIANT_AXES.badge;
export const CARD_VARIANT_AXES = GOVERNED_RECIPE_VARIANT_AXES.card;
export const SURFACE_VARIANT_AXES = GOVERNED_RECIPE_VARIANT_AXES.surface;
export const STATUS_VARIANT_AXES = GOVERNED_RECIPE_VARIANT_AXES.status;
export const FORM_CONTROL_VARIANT_AXES =
  GOVERNED_RECIPE_VARIANT_AXES["form-control"];
export const TABLE_VARIANT_AXES = GOVERNED_RECIPE_VARIANT_AXES.table;

export function getRecipeVariantAxes(
  recipeName: GovernedRecipeName
): readonly VariantAxis[] {
  return GOVERNED_RECIPE_VARIANT_AXES[recipeName];
}
