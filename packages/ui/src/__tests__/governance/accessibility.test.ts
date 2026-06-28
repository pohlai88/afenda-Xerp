import { describe, expect, it } from "vitest";

import {
  getAccessibilityPolicy,
  getComponentAccessibilityDefinition,
  getComponentAccessibilityRequirement,
  hasComponentAccessibilityDefinition,
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

  it("returns governed Badge accessibility definition without recipe ownership", () => {
    expect(getComponentAccessibilityDefinition("Badge")).toMatchObject({
      componentName: "Badge",
      rationale: expect.stringContaining("color alone"),
    });
    expect(getComponentAccessibilityDefinition("Badge")).not.toHaveProperty(
      "recipeName"
    );
  });

  it("returns governed Alert accessibility definition", () => {
    expect(getComponentAccessibilityDefinition("Alert")).toMatchObject({
      componentName: "Alert",
      rationale: expect.stringContaining("status semantics"),
    });
  });

  it("registers Field and Table accessibility definitions", () => {
    expect(hasComponentAccessibilityDefinition("Field")).toBe(true);
    expect(hasComponentAccessibilityDefinition("Table")).toBe(true);
    expect(
      getComponentAccessibilityDefinition("Field").requirements.length
    ).toBeGreaterThan(0);
  });

  it("rejects unknown governed components in development", () => {
    expect(() => getComponentAccessibilityRequirement("FancyButton")).toThrow(
      "Foundation phase 04 accessibility policy violation"
    );
  });
});
