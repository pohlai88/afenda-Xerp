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
} from "../theme-config/config.inventory.registry.js";

const themeConfigDir = join(import.meta.dirname, "../theme-config");

function discoverThemeModuleFiles(): string[] {
  return readdirSync(themeConfigDir, { withFileTypes: true })
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
        existsSync(join(themeConfigDir, entry.file)),
        `${entry.file} must exist`
      ).toBe(true);
      expect(entry.exports.length).toBeGreaterThan(0);
    }
  });

  it("exports flat-L2-theme-config series metadata", () => {
    expect(THEME_INVENTORY_SERIES).toBe("flat-L2-theme-config");
    expect(THEME_INVENTORY_MARKER).toBe("@afenda.theme-inventory");
    expect(THEME_INVENTORY_REFACTORED).toBe("2026-07-05");
  });

  it("marks boundary modules as serializable", () => {
    const serializable = listSerializableThemeModules();
    expect(serializable.map((entry) => entry.file)).toEqual([
      "config.preset.contract.ts",
      "config.presets.ts",
      "config.defaults.ts",
      "config.settings.contract.ts",
    ]);
  });
});
