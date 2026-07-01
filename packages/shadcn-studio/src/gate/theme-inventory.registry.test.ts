import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  assertThemeModuleRegistryComplete,
  diffThemeModuleRegistry,
  formatThemeModuleInventoryDiff,
  listSerializableThemeModules,
  THEME_INVENTORY_MARKER,
  THEME_INVENTORY_REFACTORED,
  THEME_INVENTORY_SERIES,
  THEME_MODULE_FILES,
  THEME_MODULE_REGISTRY,
  THEME_REGISTRY_EXCLUDED_FILES,
} from "../theme/_theme-inventory.registry.js";

const themeDir = join(import.meta.dirname, "../theme");

function discoverThemeModuleFiles(): string[] {
  return readdirSync(themeDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
        !entry.name.startsWith("_") &&
        !THEME_REGISTRY_EXCLUDED_FILES.includes(
          entry.name as (typeof THEME_REGISTRY_EXCLUDED_FILES)[number]
        )
    )
    .map((entry) => entry.name)
    .sort();
}

describe("theme module inventory registry", () => {
  const discovered = discoverThemeModuleFiles();
  const diff = diffThemeModuleRegistry(discovered);

  it("registry count matches total theme modules on disk", () => {
    expect(diff, formatThemeModuleInventoryDiff(diff)).toEqual({
      registeredCount: discovered.length,
      discoveredCount: discovered.length,
      missingOnDisk: [],
      discoveredOnly: [],
    });
    expect(assertThemeModuleRegistryComplete(discovered)).toBe(true);
  });

  it("lists exact registered file set (no extras, no omissions)", () => {
    expect(THEME_MODULE_FILES.slice().sort()).toEqual(discovered);
    expect(THEME_MODULE_REGISTRY.length).toBe(discovered.length);
  });

  it("every registry entry maps to an on-disk module", () => {
    for (const entry of THEME_MODULE_REGISTRY) {
      expect(
        existsSync(join(themeDir, entry.file)),
        `${entry.file} must exist`
      ).toBe(true);
      expect(entry.exports.length).toBeGreaterThan(0);
    }
  });

  it("exports flat-L2-theme series metadata", () => {
    expect(THEME_INVENTORY_SERIES).toBe("flat-L2-theme");
    expect(THEME_INVENTORY_MARKER).toBe("@afenda.theme-inventory");
    expect(THEME_INVENTORY_REFACTORED).toBe("2026-07-01");
  });

  it("marks boundary modules as serializable", () => {
    const serializable = listSerializableThemeModules();
    expect(serializable.map((entry) => entry.file)).toEqual([
      "theme-preset.contract.ts",
      "theme-presets.ts",
      "theme-config.ts",
      "settings.contract.ts",
      "settings-storage.ts",
      "apply-theme-preset.ts",
      "theme-font-stacks.ts",
    ]);
  });
});
