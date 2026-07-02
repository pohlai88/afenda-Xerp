import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  assertLibModuleRegistryComplete,
  diffLibModuleRegistry,
  formatLibModuleInventoryDiff,
  LIB_INVENTORY_MARKER,
  LIB_INVENTORY_REFACTORED,
  LIB_INVENTORY_SERIES,
  LIB_MODULE_FILES,
  LIB_MODULE_REGISTRY,
  LIB_REGISTRY_EXCLUDED_FILES,
  listSerializableLibModules,
} from "../../lib/_lib-inventory.registry.js";

const libDir = join(import.meta.dirname, "../../lib");

function discoverLibModuleFiles(): string[] {
  return readdirSync(libDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.startsWith("_") &&
        !LIB_REGISTRY_EXCLUDED_FILES.includes(
          entry.name as (typeof LIB_REGISTRY_EXCLUDED_FILES)[number]
        )
    )
    .map((entry) => entry.name)
    .sort();
}

describe("lib module inventory registry", () => {
  const discovered = discoverLibModuleFiles();
  const diff = diffLibModuleRegistry(discovered);

  it("registry count matches total lib/*.ts modules on disk", () => {
    expect(diff, formatLibModuleInventoryDiff(diff)).toEqual({
      registeredCount: discovered.length,
      discoveredCount: discovered.length,
      missingOnDisk: [],
      discoveredOnly: [],
    });
    expect(assertLibModuleRegistryComplete(discovered)).toBe(true);
  });

  it("lists exact registered file set (no extras, no omissions)", () => {
    expect(LIB_MODULE_FILES.slice().sort()).toEqual(discovered);
    expect(LIB_MODULE_REGISTRY.length).toBe(discovered.length);
  });

  it("every registry entry maps to an on-disk module", () => {
    for (const entry of LIB_MODULE_REGISTRY) {
      expect(
        existsSync(join(libDir, entry.file)),
        `${entry.file} must exist`
      ).toBe(true);
      expect(entry.exports.length).toBeGreaterThan(0);
    }
  });

  it("exports flat-L2-lib series metadata", () => {
    expect(LIB_INVENTORY_SERIES).toBe("flat-L2-lib");
    expect(LIB_INVENTORY_MARKER).toBe("@afenda.lib-inventory");
    expect(LIB_INVENTORY_REFACTORED).toBe("2026-07-01");
  });

  it("marks compute-pagination-range as the serializable lib boundary", () => {
    const serializable = listSerializableLibModules();
    expect(serializable.map((entry) => entry.file)).toEqual([
      "compute-pagination-range.ts",
    ]);
  });
});
