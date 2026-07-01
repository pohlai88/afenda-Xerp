import { describe, expect, expectTypeOf, it } from "vitest";
import {
  HOVER_CARD_PRIMITIVE_ID,
  HOVER_CARD_SLOTS,
  hoverCardContentClassName,
  hoverCardPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "./hover-card.contract.js";
import type {
  HoverCardContentProps,
  HoverCardSlot,
  HoverCardTriggerProps,
} from "./hover-card.js";

describe("hover-card primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports HOVER_CARD_PRIMITIVE_ID for metadata registries", () => {
    expect(HOVER_CARD_PRIMITIVE_ID).toBe("shadcn-studio.ui.hover-card");
  });

  it("exports HOVER_CARD_SLOTS", () => {
    expect(HOVER_CARD_SLOTS).toEqual({
      root: "hover-card",
      trigger: "hover-card-trigger",
      portal: "hover-card-portal",
      positioner: "hover-card-positioner",
      content: "hover-card-content",
    });
  });

  it("exports governed class constants", () => {
    expect(hoverCardContentClassName).toContain("bg-popover");
  });

  it("hoverCardPrimitiveMetadata is JSON-serializable", () => {
    const payload = hoverCardPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("HoverCardSlot is a governed slot literal union", () => {
    expectTypeOf<HoverCardSlot>().toEqualTypeOf<
      | "hover-card"
      | "hover-card-trigger"
      | "hover-card-portal"
      | "hover-card-positioner"
      | "hover-card-content"
    >();
  });

  it("HoverCardTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof HoverCardTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("HoverCardContentProps.side defaults in adapter", () => {
    expectTypeOf<HoverCardContentProps["side"]>().toEqualTypeOf<
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
