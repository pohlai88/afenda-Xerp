import { describe, expect, it } from "vitest";
import { RENDERER_CAPABILITIES, SECTION_TYPES } from "../metadata.constants.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";
import {
  getRendererCapabilityForSectionType,
  isRendererCapabilityCompatibleWithSectionType,
  RENDERER_COMPATIBILITY_RULES,
  RENDERER_CONTRACT_OWNERSHIPS,
  RENDERER_CONTRACT_PROHIBITIONS,
  rendererContract,
} from "../renderer.contract.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("rendererContract", () => {
  it("declares renderer authority", () => {
    expect(rendererContract.authority).toBe("renderer");
  });

  it("uses the canonical metadata contract version", () => {
    expect(rendererContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical renderer responsibilities", () => {
    expect(rendererContract.owns).toEqual(RENDERER_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical renderer capabilities", () => {
    expect(rendererContract.capabilities).toEqual(RENDERER_CAPABILITIES);
  });

  it("exposes canonical renderer compatibility rules", () => {
    expect(rendererContract.compatibilityRules).toEqual(
      RENDERER_COMPATIBILITY_RULES
    );
  });

  it("declares canonical renderer prohibitions", () => {
    expect(rendererContract.prohibits).toEqual(RENDERER_CONTRACT_PROHIBITIONS);
  });

  it("does not contain duplicate values", () => {
    expectUniqueValues(rendererContract.owns);
    expectUniqueValues(rendererContract.capabilities);
    expectUniqueValues(rendererContract.prohibits);
  });

  it("has exactly one compatibility rule per section type", () => {
    const mappedSectionTypes = rendererContract.compatibilityRules.map(
      (rule) => rule.sectionType
    );

    expect([...mappedSectionTypes].sort()).toEqual([...SECTION_TYPES].sort());
    expectUniqueValues(mappedSectionTypes);
  });

  it("has exactly one compatibility rule per renderer capability", () => {
    const mappedCapabilities = rendererContract.compatibilityRules.map(
      (rule) => rule.capability
    );

    expect([...mappedCapabilities].sort()).toEqual(
      [...RENDERER_CAPABILITIES].sort()
    );
    expectUniqueValues(mappedCapabilities);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(rendererContract.owns);

    for (const prohibited of rendererContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("resolves renderer capability by section type", () => {
    expect(getRendererCapabilityForSectionType("list")).toBe("render-list");
    expect(getRendererCapabilityForSectionType("chart")).toBe("render-chart");
  });

  it("checks renderer capability compatibility", () => {
    expect(
      isRendererCapabilityCompatibleWithSectionType("render-list", "list")
    ).toBe(true);

    expect(
      isRendererCapabilityCompatibleWithSectionType("render-list", "chart")
    ).toBe(false);
  });

  it("keeps renderer contract separate from implementation", () => {
    expect(rendererContract.prohibits).toEqual(
      expect.arrayContaining([
        "renderer-implementation",
        "rendering-implementation",
        "react-components",
        "ui-components",
        "business-logic",
        "database-access",
      ])
    );
  });
});
