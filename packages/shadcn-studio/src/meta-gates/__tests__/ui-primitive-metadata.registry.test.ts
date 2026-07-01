import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  assertUiPrimitiveMetadataRegistryComplete,
  diffUiPrimitiveMetadataRegistry,
  formatUiPrimitiveMetadataInventoryDiff,
  GOVERNANCE_ENVELOPE_MARKER,
  GOVERNANCE_ENVELOPE_REFACTORED,
  GOVERNANCE_ENVELOPE_SERIES,
  GOVERNANCE_REGISTRY_EXCLUDED,
  toUiPrimitiveId,
  UI_PRIMITIVE_CONTRACT_SLUGS,
  UI_PRIMITIVE_GOLD_VERSION,
  UI_PRIMITIVE_ID_PREFIX,
  UI_PRIMITIVE_METADATA_GATE,
} from "../_governance.registry.js";
import {
  getUiPrimitiveMetadata,
  getUiPrimitiveMetadataSlugs,
  UI_PRIMITIVE_METADATA_BY_ID,
  UI_PRIMITIVE_METADATA_FACTORY_COUNT,
  UI_PRIMITIVE_METADATA_REGISTRY,
} from "../ui-primitive-metadata.registry.js";

const uiDir = join(import.meta.dirname, "../../components-ui");
const governanceDir = join(import.meta.dirname, "..");

function discoverUiPrimitiveContractSlugs(): string[] {
  return readdirSync(uiDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".contract.ts") &&
        !entry.name.includes(".test.")
    )
    .map((entry) => entry.name.replace(".contract.ts", ""))
    .sort();
}

describe("ui-primitive metadata inventory registry", () => {
  const discovered = discoverUiPrimitiveContractSlugs();
  const diff = diffUiPrimitiveMetadataRegistry(discovered);

  it("registry count matches total ui/*.contract.ts files on disk", () => {
    expect(diff, formatUiPrimitiveMetadataInventoryDiff(diff)).toEqual({
      registeredCount: discovered.length,
      discoveredCount: discovered.length,
      missingOnDisk: [],
      discoveredOnly: [],
    });
    expect(assertUiPrimitiveMetadataRegistryComplete(discovered)).toBe(true);
  });

  it("lists exact registered slug set (no extras, no omissions)", () => {
    expect([...UI_PRIMITIVE_CONTRACT_SLUGS].sort()).toEqual(discovered);
    expect(UI_PRIMITIVE_CONTRACT_SLUGS.length).toBe(discovered.length);
  });

  it("exports flat-governance series metadata for envelope headers", () => {
    expect(GOVERNANCE_ENVELOPE_SERIES).toBe("flat-governance");
    expect(GOVERNANCE_ENVELOPE_MARKER).toBe("@afenda.governance-envelope");
    expect(UI_PRIMITIVE_METADATA_GATE).toBe(
      "check:studio-ui-primitive-metadata"
    );
    expect(GOVERNANCE_ENVELOPE_REFACTORED).toBe("2026-07-01");
  });

  it("inventory lives in sole _governance.registry.ts", () => {
    expect(GOVERNANCE_REGISTRY_EXCLUDED).toContain("_governance.registry.ts");
    expect(existsSync(join(governanceDir, "_governance.registry.ts"))).toBe(
      true
    );
  });
});

describe("ui-primitive-metadata.registry", () => {
  const discovered = discoverUiPrimitiveContractSlugs();

  it("factory count matches inventory SSOT", () => {
    expect(UI_PRIMITIVE_METADATA_FACTORY_COUNT).toBe(
      UI_PRIMITIVE_CONTRACT_SLUGS.length
    );
    expect(UI_PRIMITIVE_METADATA_REGISTRY.length).toBe(
      UI_PRIMITIVE_CONTRACT_SLUGS.length
    );
  });

  it("aggregated slugs match inventory and disk", () => {
    expect(getUiPrimitiveMetadataSlugs().slice().sort()).toEqual(discovered);
  });

  it("every entry uses Gold contract version", () => {
    for (const entry of UI_PRIMITIVE_METADATA_REGISTRY) {
      expect(entry.version).toBe(UI_PRIMITIVE_GOLD_VERSION);
    }
  });

  it("all IDs are unique and use shadcn-studio.ui. prefix", () => {
    const ids = UI_PRIMITIVE_METADATA_REGISTRY.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const id of ids) {
      expect(id.startsWith(UI_PRIMITIVE_ID_PREFIX)).toBe(true);
    }
  });

  it("every inventory slug maps to metadata by canonical id", () => {
    for (const slug of UI_PRIMITIVE_CONTRACT_SLUGS) {
      const id = toUiPrimitiveId(slug);
      expect(UI_PRIMITIVE_METADATA_BY_ID[id]).toBeDefined();
      expect(getUiPrimitiveMetadata(id)?.id).toBe(id);
    }
  });

  it("UI_PRIMITIVE_METADATA_BY_ID indexes every registry entry by id", () => {
    expect(Object.keys(UI_PRIMITIVE_METADATA_BY_ID).length).toBe(
      UI_PRIMITIVE_CONTRACT_SLUGS.length
    );

    for (const entry of UI_PRIMITIVE_METADATA_REGISTRY) {
      expect(UI_PRIMITIVE_METADATA_BY_ID[entry.id]).toEqual(entry);
      expect(getUiPrimitiveMetadata(entry.id)).toEqual(entry);
    }
  });

  it("every metadata payload is JSON-serializable", () => {
    for (const entry of UI_PRIMITIVE_METADATA_REGISTRY) {
      expect(() => JSON.stringify(entry)).not.toThrow();
      expect(JSON.parse(JSON.stringify(entry))).toEqual(entry);
    }
  });

  it("every on-disk contract exports PrimitiveMetadata factory", () => {
    for (const slug of discovered) {
      const contractPath = join(uiDir, `${slug}.contract.ts`);
      const source = readFileSync(contractPath, "utf8");
      expect(source, `${slug}.contract.ts metadata factory`).toMatch(
        /export function \w+PrimitiveMetadata\(\)/
      );
      expect(source, `${slug}.contract.ts version`).toContain(
        `PRIMITIVE_CONTRACT_VERSION = "${UI_PRIMITIVE_GOLD_VERSION}"`
      );
    }
  });
});
