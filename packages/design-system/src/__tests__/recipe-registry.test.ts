import { describe, expect, it } from "vitest";
import { appShellRecipe } from "../recipes/app-shell.recipe";
import { metadataUiRecipe } from "../recipes/metadata-ui.recipe";
import { AFENDA_RECIPE_REGISTRY } from "../registries/recipe.registry";
import { validateRecipeRegistry } from "../validation/recipe.validation";

const REQUIRED_RECIPES = [
  "button",
  "badge",
  "card",
  "surface",
  "form-control",
  "table",
  "status",
  "app-shell",
  "metadata-ui",
] as const;

describe("recipe registry completeness", () => {
  it("registers all required recipes without duplicates", () => {
    const names = AFENDA_RECIPE_REGISTRY.recipes.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of REQUIRED_RECIPES) {
      expect(names).toContain(name);
    }
  });

  it("includes app-shell and metadata-ui authority recipes", () => {
    expect(appShellRecipe.componentKind).toBe("app-shell");
    expect(metadataUiRecipe.componentKind).toBe("metadata-ui");
    expect(appShellRecipe.slots.some((s) => s.name === "sidebar")).toBe(true);
    expect(metadataUiRecipe.slots.some((s) => s.name === "container")).toBe(
      true
    );
  });

  it("passes recipe validation (tokens only, no Tailwind leakage)", () => {
    const failures = validateRecipeRegistry().filter((r) => !r.passed);
    expect(failures, failures.map((f) => f.detail).join("\n")).toHaveLength(0);
  });

  it("every recipe defines a root slot", () => {
    for (const recipe of AFENDA_RECIPE_REGISTRY.recipes) {
      expect(recipe.slots.some((s) => s.role === "root")).toBe(true);
    }
  });
});
