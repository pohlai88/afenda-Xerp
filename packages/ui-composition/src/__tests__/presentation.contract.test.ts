import { describe, expect, it } from "vitest";
import {
  METADATA_DENSITY_MODES,
  PRESENTATION_MODES,
} from "../metadata.constants.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";
import {
  PRESENTATION_CONTRACT_OWNERSHIPS,
  PRESENTATION_CONTRACT_PROHIBITIONS,
  presentationContract,
} from "../presentation.contract.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("presentationContract", () => {
  it("declares presentation authority", () => {
    expect(presentationContract.authority).toBe("presentation");
  });

  it("uses the canonical metadata contract version", () => {
    expect(presentationContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical presentation responsibilities", () => {
    expect(presentationContract.owns).toEqual(PRESENTATION_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical presentation modes", () => {
    expect(presentationContract.presentationModes).toEqual(PRESENTATION_MODES);
  });

  it("exposes canonical metadata density modes", () => {
    expect(presentationContract.densityModes).toEqual(METADATA_DENSITY_MODES);
  });

  it("declares canonical presentation prohibitions", () => {
    expect(presentationContract.prohibits).toEqual(
      PRESENTATION_CONTRACT_PROHIBITIONS
    );
  });

  it("does not contain duplicate values", () => {
    expectUniqueValues(presentationContract.owns);
    expectUniqueValues(presentationContract.presentationModes);
    expectUniqueValues(presentationContract.densityModes);
    expectUniqueValues(presentationContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(presentationContract.owns);

    for (const prohibited of presentationContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("keeps presentation separate from design and implementation", () => {
    expect(presentationContract.prohibits).toEqual(
      expect.arrayContaining([
        "design-tokens",
        "component-styling",
        "ui-implementation",
        "react-components",
        "renderer-implementation",
      ])
    );
  });
});
