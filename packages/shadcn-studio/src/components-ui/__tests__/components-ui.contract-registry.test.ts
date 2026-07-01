import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  toUiPrimitiveId,
  UI_PRIMITIVE_CONTRACT_SLUGS,
  UI_PRIMITIVE_GOLD_VERSION,
  UI_PRIMITIVE_ID_PREFIX,
} from "../../meta-gates/_governance.registry.js";
import {
  UI_PRIMITIVE_METADATA_BY_ID,
  UI_PRIMITIVE_METADATA_REGISTRY,
} from "../../meta-gates/ui-primitive-metadata.registry.js";

const uiDir = join(import.meta.dirname, "..");

/** T0 — static primitives: aggregate coverage only (no colocated *.contract.test.ts). */
const T0_STATIC_CONTRACT_SLUGS = [
  "aspect-ratio",
  "kbd",
  "separator",
  "skeleton",
  "spinner",
] as const;

type T0StaticContractSlug = (typeof T0_STATIC_CONTRACT_SLUGS)[number];

function discoverContractSlugs(): string[] {
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

function readContractSource(slug: string): string {
  return readFileSync(join(uiDir, `${slug}.contract.ts`), "utf8");
}

describe("components-ui contract registry (aggregate T0 + metadata SSOT)", () => {
  const discovered = discoverContractSlugs();

  it("every on-disk contract slug is registered in governance SSOT", () => {
    expect([...UI_PRIMITIVE_CONTRACT_SLUGS].sort()).toEqual(discovered);
  });

  it("every registered slug has matching metadata registry entry", () => {
    for (const slug of UI_PRIMITIVE_CONTRACT_SLUGS) {
      const id = toUiPrimitiveId(slug);
      expect(UI_PRIMITIVE_METADATA_BY_ID[id]).toBeDefined();
    }

    expect(UI_PRIMITIVE_METADATA_REGISTRY.length).toBe(
      UI_PRIMITIVE_CONTRACT_SLUGS.length
    );
  });

  it("every contract exports Gold version, primitive id, slots, and metadata factory", () => {
    for (const slug of discovered) {
      const source = readContractSource(slug);

      expect(source, `${slug}.contract.ts version`).toContain(
        `PRIMITIVE_CONTRACT_VERSION = "${UI_PRIMITIVE_GOLD_VERSION}"`
      );
      expect(source, `${slug}.contract.ts id`).toContain(
        `${UI_PRIMITIVE_ID_PREFIX}${slug}`
      );
      expect(source, `${slug}.contract.ts slots`).toMatch(/_SLOTS\s*=\s*\{/);
      expect(source, `${slug}.contract.ts metadata factory`).toMatch(
        /export function \w+PrimitiveMetadata\(\)/
      );
    }
  });

  it("every metadata payload is JSON-serializable with declared slots", () => {
    for (const entry of UI_PRIMITIVE_METADATA_REGISTRY) {
      expect(entry.id.startsWith(UI_PRIMITIVE_ID_PREFIX)).toBe(true);
      expect(entry.version).toBe(UI_PRIMITIVE_GOLD_VERSION);
      expect(Object.keys(entry.slots).length).toBeGreaterThan(0);

      const serialized = JSON.parse(JSON.stringify(entry));
      expect(serialized).toEqual(entry);
    }
  });

  it("T0 static primitives do not ship colocated contract.test.ts duplicates", () => {
    for (const slug of T0_STATIC_CONTRACT_SLUGS) {
      expect(
        existsSync(join(uiDir, `${slug}.contract.test.ts`)),
        `${slug}.contract.test.ts should be removed — covered by aggregate registry test`
      ).toBe(false);
    }
  });

  it("T0 static primitive contracts remain on disk and in metadata registry", () => {
    for (const slug of T0_STATIC_CONTRACT_SLUGS satisfies readonly T0StaticContractSlug[]) {
      expect(discovered).toContain(slug);
      expect(UI_PRIMITIVE_METADATA_BY_ID[toUiPrimitiveId(slug)]).toBeDefined();
    }
  });

  it("kanban is registered as T3 compound primitive with full slot map", () => {
    const kanban = UI_PRIMITIVE_METADATA_BY_ID["shadcn-studio.ui.kanban"];
    expect(kanban).toBeDefined();
    expect(Object.keys(kanban?.slots ?? {})).toEqual([
      "root",
      "board",
      "column",
      "columnHandle",
      "columnContent",
      "item",
      "itemHandle",
      "addColumn",
      "addItem",
    ]);
  });
});
