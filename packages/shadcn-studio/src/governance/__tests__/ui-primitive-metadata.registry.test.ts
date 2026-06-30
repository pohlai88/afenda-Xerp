import { describe, expect, it } from "vitest";

import {
  getUiPrimitiveMetadata,
  listUiPrimitiveMetadata,
  UI_PRIMITIVE_METADATA_BY_ID,
  UI_PRIMITIVE_METADATA_REGISTRY,
} from "../ui-primitive-metadata.registry.js";

/** 28 widgets + 41 composition — verified by check-studio-*-contracts gates. */
const EXPECTED_PRIMITIVE_COUNT = 69;
const GOLD_CONTRACT_VERSION = "1.2.0";
const PRIMITIVE_ID_PREFIX = "shadcn-studio.ui.";

describe("ui-primitive-metadata.registry", () => {
  it("aggregates all governed primitive metadata payloads", () => {
    expect(UI_PRIMITIVE_METADATA_REGISTRY.length).toBe(
      EXPECTED_PRIMITIVE_COUNT
    );
    expect(listUiPrimitiveMetadata().length).toBe(EXPECTED_PRIMITIVE_COUNT);
  });

  it("every entry uses Gold contract version 1.2.0", () => {
    for (const entry of UI_PRIMITIVE_METADATA_REGISTRY) {
      expect(entry.version).toBe(GOLD_CONTRACT_VERSION);
    }
  });

  it("all IDs are unique and use shadcn-studio.ui. prefix", () => {
    const ids = UI_PRIMITIVE_METADATA_REGISTRY.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const id of ids) {
      expect(id.startsWith(PRIMITIVE_ID_PREFIX)).toBe(true);
    }
  });

  it("UI_PRIMITIVE_METADATA_BY_ID indexes every registry entry by id", () => {
    expect(Object.keys(UI_PRIMITIVE_METADATA_BY_ID).length).toBe(
      EXPECTED_PRIMITIVE_COUNT
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
});
