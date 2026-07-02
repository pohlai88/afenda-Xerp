import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  TOOLTIP_PRIMITIVE_ID,
  TOOLTIP_SLOTS,
  tooltipContentClassName,
  tooltipPrimitiveMetadata,
} from "../../components-ui/tooltip.contract.js";
import type {
  TooltipContentProps,
  TooltipSlot,
  TooltipTriggerProps,
} from "../../components-ui/tooltip.js";

describe("tooltip primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports TOOLTIP_PRIMITIVE_ID for metadata registries", () => {
    expect(TOOLTIP_PRIMITIVE_ID).toBe("shadcn-studio.ui.tooltip");
  });

  it("exports TOOLTIP_SLOTS", () => {
    expect(TOOLTIP_SLOTS).toEqual({
      provider: "tooltip-provider",
      root: "tooltip",
      trigger: "tooltip-trigger",
      portal: "tooltip-portal",
      positioner: "tooltip-positioner",
      content: "tooltip-content",
      arrow: "tooltip-arrow",
    });
  });

  it("exports governed class constants", () => {
    expect(tooltipContentClassName).toContain("bg-foreground");
  });

  it("tooltipPrimitiveMetadata is JSON-serializable", () => {
    const payload = tooltipPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("TooltipSlot is a governed slot literal union", () => {
    expectTypeOf<TooltipSlot>().toEqualTypeOf<
      | "tooltip-provider"
      | "tooltip"
      | "tooltip-trigger"
      | "tooltip-portal"
      | "tooltip-positioner"
      | "tooltip-content"
      | "tooltip-arrow"
    >();
  });

  it("TooltipTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof TooltipTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("TooltipContentProps.side defaults in adapter", () => {
    expectTypeOf<TooltipContentProps["side"]>().toEqualTypeOf<
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "inline-start"
      | "inline-end"
      | undefined
    >();
  });
});
