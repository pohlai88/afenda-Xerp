import { recipeRegistry } from "@afenda/design-system";
import type { MetadataStateContract } from "../contracts/metadata-state.contract";

export interface MetadataStatePresentation {
  readonly recipe: "status-state";
  readonly recipeAvailable: boolean;
  readonly state: MetadataStateContract;
}

export const resolveMetadataStatePresentation = (
  state: MetadataStateContract
): MetadataStatePresentation => ({
  recipe: "status-state",
  recipeAvailable: recipeRegistry.recipes.some(
    (recipe) => recipe.name === "status"
  ),
  state,
});
