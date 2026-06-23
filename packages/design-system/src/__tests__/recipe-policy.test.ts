import { describe, expect, it } from "vitest";
import { visualDriftPolicy } from "../policies/visual-drift-policy";
import { AFENDA_RECIPE_REGISTRY } from "../registries/recipe.registry";
import { validateRecipeRegistry } from "../validation/recipe.validation";

const RAW_VALUE_PATTERN =
  /^(oklch|#[0-9a-f]{3,8}|rgb|hsl|\d+px|\d+rem|\d+ms)/iu;

describe("recipe policy", () => {
  it("rejects raw values in recipe token declarations", () => {
    for (const recipe of AFENDA_RECIPE_REGISTRY.recipes) {
      for (const decl of recipe.declarations) {
        expect(decl.token.startsWith("afenda.")).toBe(true);
        expect(RAW_VALUE_PATTERN.test(decl.token)).toBe(false);
      }
    }
  });

  it("passes validateRecipeRegistry", () => {
    const failures = validateRecipeRegistry().filter((r) => !r.passed);
    expect(failures).toHaveLength(0);
  });

  it("defines visual drift prohibitions for enterprise anti-slop", () => {
    expect(visualDriftPolicy.prohibitedVisualSlop.length).toBeGreaterThan(5);
    expect(visualDriftPolicy.prohibitedVisualSlop.join(" ")).toMatch(
      /gradient|glassmorphism|emoji/i
    );
  });
});
