import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { recipeRegistry } from "../design-authority/index.js";

import { GOVERNED_UI_RECIPES, resolveGovernedRecipe } from "../governance";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("@afenda/ui design-authority consumption", () => {
  it("exports @afenda/ui/design-authority from package.json", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as { exports?: Record<string, unknown> };

    expect(packageJson.exports?.["./design-authority"]).toBeDefined();
  });

  it("keeps governed UI recipes aligned with authority registry", () => {
    const authorityNames = new Set(
      recipeRegistry.recipes.map((entry) => entry.name)
    );

    for (const recipeName of GOVERNED_UI_RECIPES) {
      expect(authorityNames.has(recipeName)).toBe(true);
    }
  });

  it("resolves recipes without raw palette utilities", () => {
    const className = resolveGovernedRecipe("button", {
      intent: "primary",
      emphasis: "solid",
      size: "md",
    }).className;

    expect(className).not.toMatch(/bg-(red|blue|green)-\d+/u);
    expect(className).toContain("group/button");
  });
});
