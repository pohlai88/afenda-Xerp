import { describe, expect, it } from "vitest";

import {
  getAccessibilityPolicy,
  getComponentAccessibilityDefinition,
  getComponentAccessibilityRequirement,
} from "../../governance";

describe("accessibility governance", () => {
  it("uses governed baseline accessibility requirements", () => {
    expect(getAccessibilityPolicy().baseline).toContain("semanticElement");
    expect(getAccessibilityPolicy().baseline).toContain("keyboardReachable");
    expect(getAccessibilityPolicy().baseline).toContain("visibleFocus");
    expect(getAccessibilityPolicy().baseline).toContain("programmaticName");
    expect(getAccessibilityPolicy().baseline).toContain("reducedMotionSafe");
  });

  it("returns governed Button accessibility requirements", () => {
    expect(getComponentAccessibilityRequirement("Button")).toContain(
      "programmaticName"
    );
  });

  it("returns governed Badge accessibility definition", () => {
    expect(getComponentAccessibilityDefinition("Badge")).toMatchObject({
      componentName: "Badge",
      recipeName: "badge",
    });
  });

  it("rejects unknown governed components in development", () => {
    expect(() =>
      getComponentAccessibilityRequirement("FancyButton")
    ).toThrow("TIP-004 accessibility policy violation");
  });
});
