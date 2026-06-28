import { describe, expect, it } from "vitest";
import {
  LAYOUT_CONTRACT_OWNERSHIPS,
  LAYOUT_CONTRACT_PROHIBITIONS,
  layoutContract,
} from "../layout.contract.js";
import { LAYOUT_TYPES } from "../metadata.constants.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";

describe("layoutContract", () => {
  it("declares the layout authority", () => {
    expect(layoutContract.authority).toBe("layout");
  });

  it("uses the metadata contract version", () => {
    expect(layoutContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical layout responsibilities", () => {
    expect(layoutContract.owns).toEqual(LAYOUT_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical layout types", () => {
    expect(layoutContract.types).toEqual(LAYOUT_TYPES);
  });

  it("prohibits implementation concerns", () => {
    expect(layoutContract.prohibits).toEqual(LAYOUT_CONTRACT_PROHIBITIONS);
  });

  it("does not own prohibited responsibilities", () => {
    const ownerships = new Set(layoutContract.owns);

    for (const prohibited of layoutContract.prohibits) {
      expect(ownerships.has(prohibited as never)).toBe(false);
    }
  });
});
