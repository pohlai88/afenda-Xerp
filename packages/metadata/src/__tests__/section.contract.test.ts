import { describe, expect, it } from "vitest";
import { SECTION_TYPES } from "../metadata.constants.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";
import {
  SECTION_CONTRACT_OWNERSHIPS,
  SECTION_CONTRACT_PROHIBITIONS,
  sectionContract,
} from "../section.contract.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("sectionContract", () => {
  it("declares section authority", () => {
    expect(sectionContract.authority).toBe("section");
  });

  it("uses the canonical metadata contract version", () => {
    expect(sectionContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical section responsibilities", () => {
    expect(sectionContract.owns).toEqual(SECTION_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical section types", () => {
    expect(sectionContract.types).toEqual(SECTION_TYPES);
  });

  it("declares canonical section prohibitions", () => {
    expect(sectionContract.prohibits).toEqual(SECTION_CONTRACT_PROHIBITIONS);
  });

  it("does not contain duplicate values", () => {
    expectUniqueValues(sectionContract.owns);
    expectUniqueValues(sectionContract.types);
    expectUniqueValues(sectionContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(sectionContract.owns);

    for (const prohibited of sectionContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("keeps section governance separate from layout, renderer, and UI concerns", () => {
    expect(sectionContract.prohibits).toEqual(
      expect.arrayContaining([
        "layout-arrangements",
        "renderer-selection",
        "renderer-implementation",
        "ui-implementation",
        "business-logic",
        "database-access",
      ])
    );
  });
});
