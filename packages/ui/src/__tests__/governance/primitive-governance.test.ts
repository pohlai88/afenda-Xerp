import { describe, expect, it } from "vitest";

import { resolvePrimitiveGovernance } from "../../governance/primitive-governance";

describe("resolvePrimitiveGovernance", () => {
  it("resolves a governed primitive with recipe, slot, state, motion, accessibility, and data attributes", () => {
    const result = resolvePrimitiveGovernance({
      componentName: "Button",
      variant: {
        intent: "primary",
        emphasis: "solid",
        size: "md",
      },
      slot: "root",
    });

    expect(result.recipeName).toBe("button");
    expect(result.state).toBe("ready");
    expect(result.slot).toBe("root");
    expect(result.motion.intent).toBe("feedback");
    expect(result.dataAttributes["data-component"]).toBe("Button");
    expect(result.dataAttributes["data-recipe"]).toBe("button");
    expect(result.dataAttributes["data-slot"]).toBe("button");
    expect(result.className).toContain("inline-flex");
    expect(result.accessibility.length).toBeGreaterThan(0);
  });

  it("resolves button presentation through the recipe pipeline", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Button",
      recipeName: "button",
      variant: { intent: "primary", emphasis: "solid", size: "md" },
      slot: "root",
    });

    expect(governed.recipeName).toBe("button");
    expect(governed.className).toContain("bg-primary");
    expect(governed.dataAttributes["data-component"]).toBe("Button");
    expect(governed.dataAttributes["data-slot"]).toBe("button");
    expect(governed.state).toBe("ready");
    expect(governed.motion.intent).toBe("feedback");
  });

  it("resolves card slot presentation from the registry", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Card",
      slot: "header",
      className: "max-w-lg",
    });

    expect(governed.className).toContain("group/card-header");
    expect(governed.dataAttributes["data-slot"]).toBe("card-header");
  });

  it("resolves alert status tone through the status recipe", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Alert",
      variant: { tone: "danger", density: "standard", radius: "md" },
      slot: "root",
    });

    expect(governed.recipeName).toBe("status");
    expect(governed.className).toContain("group/status");
    expect(governed.dataAttributes["data-slot"]).toBe("alert");
  });

  it("allows layout-only className overrides", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Button",
      variant: { intent: "primary", emphasis: "solid", size: "md" },
      className: "w-full",
    });

    expect(governed.className).toContain("w-full");
  });

  it("rejects unknown governed component names", () => {
    expect(() =>
      resolvePrimitiveGovernance({
        componentName: "Dialog" as "Button",
        slot: "root",
      })
    ).toThrow(/Unknown governed component/);
  });

  it("rejects a globally valid but component-invalid slot", () => {
    expect(() =>
      resolvePrimitiveGovernance({
        componentName: "Button",
        slot: "header",
      })
    ).toThrow(/primitive slot violation/);
  });

  it("rejects unknown slotKey", () => {
    expect(() =>
      resolvePrimitiveGovernance({
        componentName: "Button",
        slotKey: "unknown",
      })
    ).toThrow(/primitive slot key violation/);
  });

  it("rejects semantic consumer className", () => {
    expect(() =>
      resolvePrimitiveGovernance({
        componentName: "Button",
        className: "bg-red-500",
      })
    ).toThrow(/className policy violation/);
  });

  it("resolves field slotKey subparts from the registry", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Field",
      slotKey: "title",
    });

    expect(governed.dataAttributes["data-slot"]).toBe("field-label");
    expect(governed.className.length).toBeGreaterThan(0);
  });

  it("resolves leaf form controls without the group recipe shell", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Input",
      variant: { density: "standard", size: "md" },
      slot: "root",
    });

    expect(governed.recipeName).toBe("form-control");
    expect(governed.className).toContain("rounded-lg");
    expect(governed.className).not.toContain("group/form-control");
    expect(governed.dataAttributes["data-slot"]).toBe("input");
  });
});
