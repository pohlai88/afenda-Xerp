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
    expect(governed.className).not.toContain("group/card flex flex-col");
    expect(governed.dataAttributes["data-slot"]).toBe("card-header");
  });

  it("emits governed card layout size on root data attributes", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Card",
      recipeName: "card",
      variant: { density: "standard", radius: "md", shadow: "raised" },
      layoutSize: "sm",
      slot: "root",
    });

    expect(governed.dataAttributes["data-size"]).toBe("sm");
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

  it("resolves alert slot presentation without root recipe classes", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Alert",
      recipeName: "status",
      slot: "label",
      className: "max-w-lg",
    });

    expect(governed.className).toContain("font-medium");
    expect(governed.className).not.toContain("group/status relative grid");
    expect(governed.dataAttributes["data-slot"]).toBe("alert-title");
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
        componentName: "NotARealComponent" as "Button",
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
      recipeName: "form-control",
      slotKey: "title",
    });

    expect(governed.dataAttributes["data-slot"]).toBe("field-label");
    expect(governed.className.length).toBeGreaterThan(0);
  });

  it("resolves command input-search-icon slotKey from the registry", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Command",
      recipeName: "surface",
      slotKey: "input-search-icon",
    });

    expect(governed.dataAttributes["data-slot"]).toBe("command-search-icon");
    expect(governed.className).toContain("opacity-50");
  });

  it("resolves governed field separator line slotKey", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Field",
      recipeName: "form-control",
      slotKey: "separatorLine",
    });

    expect(governed.dataAttributes["data-slot"]).toBe("field-separator-line");
    expect(governed.className).toContain("absolute");
    expect(governed.className).not.toContain("group/form-control");
  });

  it("resolves field body slot without group recipe shell", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Field",
      recipeName: "form-control",
      slot: "body",
    });

    expect(governed.className).toContain("group/field-group");
    expect(governed.className).not.toContain("group/form-control");
    expect(governed.dataAttributes["data-slot"]).toBe("field-group");
  });

  it("resolves table row slotKey without root recipe shell", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Table",
      recipeName: "table",
      slotKey: "row",
    });

    expect(governed.dataAttributes["data-slot"]).toBe("table-row");
    expect(governed.className).toContain("border-b");
    expect(governed.className).not.toContain("group/table");
  });

  it("resolves table container slotKey separately from root", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Table",
      recipeName: "table",
      slotKey: "container",
      className: "max-h-96",
    });

    expect(governed.dataAttributes["data-slot"]).toBe("table-container");
    expect(governed.className).toContain("overflow-x-auto");
    expect(governed.className).not.toContain("group/table");
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

  it("resolves InputGroup root as horizontal flex without Field form-control shell", () => {
    const governed = resolvePrimitiveGovernance({
      componentName: "InputGroup",
      recipeName: "form-control",
      slot: "root",
    });

    expect(governed.recipeName).toBe("form-control");
    expect(governed.className).toContain("group/input-group");
    expect(governed.className).toContain("items-center");
    expect(governed.className).not.toContain("group/form-control");
    expect(governed.dataAttributes["data-slot"]).toBe("input-group");
  });

  it("resolves Sheet close-button slotKey with registry data-slot and positioning", () => {
    const closeButton = resolvePrimitiveGovernance({
      componentName: "Sheet",
      recipeName: "surface",
      slotKey: "close-button",
    });
    const closeLabel = resolvePrimitiveGovernance({
      componentName: "Sheet",
      recipeName: "surface",
      slotKey: "close-label",
    });

    expect(closeButton.dataAttributes["data-slot"]).toBe("sheet-close-button");
    expect(closeButton.className).toContain("absolute");
    expect(closeLabel.dataAttributes["data-slot"]).toBe("sheet-close-label");
    expect(closeLabel.className).toContain("sr-only");
  });

  it("resolves Dialog close-button slotKey with registry data-slot and positioning", () => {
    const closeButton = resolvePrimitiveGovernance({
      componentName: "Dialog",
      recipeName: "surface",
      slotKey: "close-button",
    });
    const closeLabel = resolvePrimitiveGovernance({
      componentName: "Dialog",
      recipeName: "surface",
      slotKey: "close-label",
    });

    expect(closeButton.dataAttributes["data-slot"]).toBe("dialog-close-button");
    expect(closeButton.className).toContain("absolute");
    expect(closeLabel.dataAttributes["data-slot"]).toBe("dialog-close-label");
    expect(closeLabel.className).toContain("sr-only");
  });

  it("resolves Chart tooltip-row-dot slotKey with registry data-slot and layout", () => {
    const row = resolvePrimitiveGovernance({
      componentName: "Chart",
      recipeName: "surface",
      slot: "control",
      slotKey: "tooltip-row-dot",
    });
    const indicator = resolvePrimitiveGovernance({
      componentName: "Chart",
      recipeName: "surface",
      slot: "control",
      slotKey: "indicator-dot",
    });

    expect(row.dataAttributes["data-slot"]).toBe("chart-tooltip-row");
    expect(row.className).toContain("items-center");
    expect(indicator.dataAttributes["data-slot"]).toBe("chart-tooltip-indicator");
    expect(indicator.className).toContain("rounded-[2px]");
  });
});
