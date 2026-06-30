import { describe, expect, expectTypeOf, it } from "vitest";
import {
  POPOVER_PRIMITIVE_ID,
  POPOVER_SLOTS,
  PRIMITIVE_CONTRACT_VERSION,
  popoverContentClassName,
  popoverPrimitiveMetadata,
} from "./popover.contract.js";
import type {
  PopoverContentProps,
  PopoverSlot,
  PopoverTriggerProps,
} from "./popover.js";

describe("popover primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports POPOVER_PRIMITIVE_ID for metadata registries", () => {
    expect(POPOVER_PRIMITIVE_ID).toBe("shadcn-studio.ui.popover");
  });

  it("exports POPOVER_SLOTS", () => {
    expect(POPOVER_SLOTS).toEqual({
      root: "popover",
      trigger: "popover-trigger",
      portal: "popover-portal",
      positioner: "popover-positioner",
      content: "popover-content",
      header: "popover-header",
      title: "popover-title",
      description: "popover-description",
    });
  });

  it("exports governed class constants", () => {
    expect(popoverContentClassName).toContain("bg-popover");
  });

  it("popoverPrimitiveMetadata is JSON-serializable", () => {
    const payload = popoverPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("PopoverSlot is a governed slot literal union", () => {
    expectTypeOf<PopoverSlot>().toEqualTypeOf<
      | "popover"
      | "popover-trigger"
      | "popover-portal"
      | "popover-positioner"
      | "popover-content"
      | "popover-header"
      | "popover-title"
      | "popover-description"
    >();
  });

  it("PopoverTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof PopoverTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("PopoverContentProps.side defaults in adapter", () => {
    expectTypeOf<PopoverContentProps["side"]>().toEqualTypeOf<
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
