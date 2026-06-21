import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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
  type GovernedUiComponentName,
} from "../../governance/types";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const GOVERNANCE_HELPERS: Partial<
  Record<GovernedUiComponentName, readonly string[]>
> = {
  Chart: ["chartGovernance"],
  Sidebar: ["sidebarClass"],
  Combobox: ["comboboxGovernance"],
  Calendar: ["calendarClass"],
  Field: ["resolveFieldGovernance"],
  Table: ["resolveTableGovernance"],
};

function readComponentSource(sourceFile: string): string {
  return readFileSync(join(packageRoot, sourceFile), "utf8");
}

function collectExplicitSlotKeys(
  source: string,
  componentName: string
): string[] {
  const keys = new Set<string>();

  for (const match of source.matchAll(
    /resolvePrimitiveGovernance\(\{([\s\S]*?)\}\)/gu
  )) {
    const block = match[1];
    if (block === undefined) {
      continue;
    }

    if (!block.includes(`componentName: "${componentName}"`)) {
      continue;
    }

    for (const slotMatch of block.matchAll(/slotKey:\s*["']([^"']+)["']/gu)) {
      const key = slotMatch[1];
      if (key !== undefined) {
        keys.add(key);
      }
    }
  }

  return [...keys];
}

function collectComponentSlotKeys(
  source: string,
  componentName: GovernedUiComponentName
): string[] {
  const keys = new Set<string>(collectExplicitSlotKeys(source, componentName));

  for (const helper of GOVERNANCE_HELPERS[componentName] ?? []) {
    if (helper === "calendarClass") {
      for (const match of source.matchAll(/calendarClass\(\s*["']([^"']+)["']/gu)) {
        const key = match[1];
        if (key !== undefined) {
          keys.add(key);
        }
      }
      continue;
    }

    for (const match of source.matchAll(
      new RegExp(`${helper}\\([\\s\\S]*?\\)`, "gu")
    )) {
      const block = match[0];
      for (const slotMatch of block.matchAll(/slotKey:\s*["']([^"']+)["']/gu)) {
        const key = slotMatch[1];
        if (key !== undefined) {
          keys.add(key);
        }
      }
    }
  }

  return [...keys];
}

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

  it("maps every dataSlotByKey entry to slotClassNamesByKey", () => {
    for (const componentName of GOVERNED_UI_COMPONENTS) {
      const definition = getPrimitiveDefinition(componentName);
      const classKeys = Object.keys(definition.slotClassNamesByKey ?? {});

      for (const slotKey of Object.keys(definition.dataSlotByKey ?? {})) {
        expect(
          classKeys,
          `${componentName} dataSlotByKey "${slotKey}" is missing from slotClassNamesByKey`
        ).toContain(slotKey);
      }
    }
  });

  it("maps every static slotKey in component source to registry keys", () => {
    for (const componentName of GOVERNED_UI_COMPONENTS) {
      const definition = getPrimitiveDefinition(componentName);
      const source = readComponentSource(definition.sourceFile);
      const usedSlotKeys = collectComponentSlotKeys(source, componentName);
      const classKeys = Object.keys(definition.slotClassNamesByKey ?? {});
      const dataSlotKeys = Object.keys(definition.dataSlotByKey ?? {});

      for (const slotKey of usedSlotKeys) {
        expect(
          classKeys,
          `${componentName} uses slotKey "${slotKey}" but slotClassNamesByKey is missing it`
        ).toContain(slotKey);
        expect(
          dataSlotKeys,
          `${componentName} uses slotKey "${slotKey}" but dataSlotByKey is missing it`
        ).toContain(slotKey);
      }
    }
  });

  it("maps Command explicit slotKey usage to dataSlotByKey", () => {
    const definition = getPrimitiveDefinition("Command");
    const source = readComponentSource(definition.sourceFile);
    const slotKeys = collectExplicitSlotKeys(source, "Command");
    const dataSlotKeys = Object.keys(definition.dataSlotByKey ?? {});

    for (const slotKey of slotKeys) {
      expect(
        dataSlotKeys,
        `Command uses slotKey "${slotKey}" but dataSlotByKey is missing it`
      ).toContain(slotKey);
    }
  });
});
