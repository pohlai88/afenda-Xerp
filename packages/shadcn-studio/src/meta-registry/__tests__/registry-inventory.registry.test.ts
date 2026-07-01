import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  assertRegistryModuleInventoryComplete,
  diffRegistryModuleInventory,
  formatRegistryModuleInventoryDiff,
  listSerializableRegistryModules,
  REGISTRY_INVENTORY_EXCLUDED,
  REGISTRY_INVENTORY_GATE,
  REGISTRY_INVENTORY_MARKER,
  REGISTRY_INVENTORY_REFACTORED,
  REGISTRY_INVENTORY_SERIES,
  REGISTRY_MODULE_FILES,
  REGISTRY_MODULE_REGISTRY,
} from "../_registry-inventory.registry.js";

const registryDir = join(import.meta.dirname, "..");

function discoverRegistryModuleFiles(): string[] {
  return readdirSync(registryDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
        !entry.name.startsWith("_") &&
        !REGISTRY_INVENTORY_EXCLUDED.includes(
          entry.name as (typeof REGISTRY_INVENTORY_EXCLUDED)[number]
        )
    )
    .map((entry) => entry.name)
    .sort();
}

describe("registry module inventory", () => {
  const discovered = discoverRegistryModuleFiles();
  const diff = diffRegistryModuleInventory(discovered);

  it("registry count matches total registry/* modules on disk", () => {
    expect(diff, formatRegistryModuleInventoryDiff(diff)).toEqual({
      registeredCount: discovered.length,
      discoveredCount: discovered.length,
      missingOnDisk: [],
      discoveredOnly: [],
    });
    expect(assertRegistryModuleInventoryComplete(discovered)).toBe(true);
  });

  it("lists exact registered file set (no extras, no omissions)", () => {
    expect(REGISTRY_MODULE_FILES.slice().sort()).toEqual(discovered);
    expect(REGISTRY_MODULE_REGISTRY.length).toBe(discovered.length);
  });

  it("every registry entry maps to an on-disk module", () => {
    for (const entry of REGISTRY_MODULE_REGISTRY) {
      expect(
        existsSync(join(registryDir, entry.file)),
        `${entry.file} must exist`
      ).toBe(true);
    }
  });

  it("exports flat-L1-registry series metadata", () => {
    expect(REGISTRY_INVENTORY_SERIES).toBe("flat-L1-registry");
    expect(REGISTRY_INVENTORY_MARKER).toBe("@afenda.registry-inventory");
    expect(REGISTRY_INVENTORY_GATE).toBe("check:studio-registry-inventory");
    expect(REGISTRY_INVENTORY_REFACTORED).toBe("2026-07-01");
  });

  it("marks wire-boundary modules as serializable (exhaustive snapshot)", () => {
    const serializableFiles = listSerializableRegistryModules()
      .map((entry) => entry.file)
      .sort();
    const nonSerializableFiles = REGISTRY_MODULE_REGISTRY.filter(
      (entry) => !entry.serializable
    )
      .map((entry) => entry.file)
      .sort();

    expect(serializableFiles).toEqual([
      "acceptance-record.registry.ts",
      "block-lifecycle.ts",
      "block-slot-template-families.ts",
      "block-slot.registry.ts",
      "block-slot.types.ts",
      "mcp-seed-block-manifest.ts",
      "metadata-binding-module-assignment.ts",
      "metadata-binding-overrides.registry.ts",
      "metadata-binding-waiver.registry.ts",
      "metadata-binding.registry.ts",
      "presentation-inventory.registry.ts",
      "studio-block-parity.registry.ts",
      "surface-template.registry.ts",
    ]);

    expect(nonSerializableFiles).toEqual([
      "assert-block-slot-dom-marker-coverage.ts",
      "assert-metadata-binding-coverage.ts",
      "block-lifecycle-mutation.ts",
      "build-metadata-binding-from-data-contracts.ts",
      "build-presentation-inventory-from-parity.ts",
      "studio-block-component.registry.tsx",
    ]);
  });

  it("inventory meta file is excluded from module scans", () => {
    expect(REGISTRY_INVENTORY_EXCLUDED).toContain(
      "_registry-inventory.registry.ts"
    );
    expect(
      existsSync(join(registryDir, "_registry-inventory.registry.ts"))
    ).toBe(true);
  });
});
