import { describe, expect, it } from "vitest";
import { SURFACE_TYPES } from "../metadata.constants.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";
import {
  SURFACE_CONTRACT_OWNERSHIPS,
  SURFACE_CONTRACT_PROHIBITIONS,
  surfaceContract,
} from "../surface.contract.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("surfaceContract", () => {
  it("declares surface authority", () => {
    expect(surfaceContract.authority).toBe("surface");
  });

  it("uses the canonical metadata contract version", () => {
    expect(surfaceContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical surface responsibilities", () => {
    expect(surfaceContract.owns).toEqual(SURFACE_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical surface types", () => {
    expect(surfaceContract.types).toEqual(SURFACE_TYPES);
  });

  it("declares canonical surface prohibitions", () => {
    expect(surfaceContract.prohibits).toEqual(SURFACE_CONTRACT_PROHIBITIONS);
  });

  it("does not contain duplicate values", () => {
    expectUniqueValues(surfaceContract.owns);
    expectUniqueValues(surfaceContract.types);
    expectUniqueValues(surfaceContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(surfaceContract.owns);

    for (const prohibited of surfaceContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("keeps surface governance separate from section, layout, renderer, and UI concerns", () => {
    expect(surfaceContract.prohibits).toEqual(
      expect.arrayContaining([
        "sections",
        "layout-arrangements",
        "renderers",
        "ui-implementation",
        "business-logic",
        "database-access",
      ])
    );
  });
});
