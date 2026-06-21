import { describe, expect, it } from "vitest";

import { assertMotionPolicyCoverageStrict } from "../../governance/motion";
import {
  EXPORTED_STOCK_COMPONENTS,
  GOVERNED_PRIMITIVE_REGISTRY,
  getPrimitiveDefinition,
  isGovernedPrimitive,
  PRIMARY_UI_EXPORTS,
  STOCK_SHADCN_PENDING,
} from "../../governance/primitive-registry";
import { getRecipeVariantAxes } from "../../governance/recipe-coverage";
import {
  GOVERNED_UI_COMPONENTS,
  GOVERNED_UI_RECIPES,
} from "../../governance/types";

describe("GOVERNED_PRIMITIVE_REGISTRY", () => {
  it("has complete motion policy coverage", () => {
    expect(() => assertMotionPolicyCoverageStrict()).not.toThrow();
  });

  it("assigns recipe axes for every governed component", () => {
    for (const componentName of GOVERNED_UI_COMPONENTS) {
      const definition = getPrimitiveDefinition(componentName);
      expect(definition.componentName).toBe(componentName);
      expect(GOVERNED_UI_RECIPES).toContain(definition.recipeName);
      expect(
        getRecipeVariantAxes(definition.recipeName).length
      ).toBeGreaterThan(0);
    }
  });

  it("maps unique source files for phase 1 governed components", () => {
    const sourceFiles = GOVERNED_UI_COMPONENTS.map(
      (name) => GOVERNED_PRIMITIVE_REGISTRY[name].sourceFile
    );
    expect(new Set(sourceFiles).size).toBe(sourceFiles.length);
  });

  it("keeps stock pending disjoint from governed source files", () => {
    const governedFiles = new Set<string>(
      GOVERNED_UI_COMPONENTS.map(
        (name) => GOVERNED_PRIMITIVE_REGISTRY[name].sourceFile
      )
    );

    for (const pendingFile of STOCK_SHADCN_PENDING) {
      expect(governedFiles.has(pendingFile)).toBe(false);
    }
  });

  it("covers primary exports with governed or stock pending declarations", () => {
    for (const exportName of PRIMARY_UI_EXPORTS) {
      const isGoverned = isGovernedPrimitive(exportName);
      const isStock = (EXPORTED_STOCK_COMPONENTS as readonly string[]).includes(
        exportName
      );
      expect(isGoverned || isStock).toBe(true);
    }
  });

  it("declares allowed slots that include defaultSlot and dataSlotByRole keys", () => {
    for (const componentName of GOVERNED_UI_COMPONENTS) {
      const definition = getPrimitiveDefinition(componentName);

      expect(definition.slots).toContain(definition.defaultSlot);

      for (const role of Object.keys(definition.dataSlotByRole)) {
        expect(definition.slots).toContain(role);
      }
    }
  });
});
