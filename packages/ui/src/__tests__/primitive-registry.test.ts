import { describe, expect, it } from "vitest";
import { recipeRegistry } from "../design-authority/index.js";
import {
  GOVERNED_PRIMITIVE_REGISTRY,
  getPrimitiveDefinition,
} from "../governance/primitive-registry";
import {
  CORE_PRIMITIVE_NAMES,
  getPrimitiveRegistryEntry,
  PRIMITIVE_REGISTRY_ENTRIES,
} from "../governance/primitive-registry-meta";

describe("primitive registry alignment", () => {
  it("registers all core primitives without duplicates", () => {
    expect(new Set(CORE_PRIMITIVE_NAMES).size).toBe(
      CORE_PRIMITIVE_NAMES.length
    );
    for (const name of CORE_PRIMITIVE_NAMES) {
      expect(GOVERNED_PRIMITIVE_REGISTRY[name]).toBeDefined();
      expect(PRIMITIVE_REGISTRY_ENTRIES[name]).toBeDefined();
    }
  });

  it("maps each core primitive to a known design-system recipe", () => {
    const authorityRecipes = new Set(
      recipeRegistry.recipes.map((entry) => entry.name)
    );

    for (const name of CORE_PRIMITIVE_NAMES) {
      const entry = getPrimitiveRegistryEntry(name);
      const definition = getPrimitiveDefinition(name);
      expect(entry.recipe).toBe(definition.recipeName);
      expect(authorityRecipes.has(entry.recipe)).toBe(true);
      expect(entry.ownerPackage).toBe("@afenda/ui");
      expect(entry.lifecycle).toBe("active");
    }
  });

  it("requires accessibility contract on core primitives", () => {
    for (const name of CORE_PRIMITIVE_NAMES) {
      const entry = getPrimitiveRegistryEntry(name);
      expect(entry.accessibility.focusVisible).toBe(true);
      expect(entry.accessibility.aria).toBe(true);
    }
  });
});
