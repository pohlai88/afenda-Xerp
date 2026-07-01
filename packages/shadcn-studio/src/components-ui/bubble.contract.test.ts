import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BUBBLE_PRIMITIVE_ID,
  BUBBLE_SLOTS,
  bubblePrimitiveMetadata,
  bubbleVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "./bubble.contract.js";
import type { BubbleProps, BubbleSlot } from "./bubble.js";

describe("bubble primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BUBBLE_PRIMITIVE_ID for metadata registries", () => {
    expect(BUBBLE_PRIMITIVE_ID).toBe("shadcn-studio.ui.bubble");
  });

  it("exports BUBBLE_SLOTS", () => {
    expect(BUBBLE_SLOTS).toEqual({
      group: "bubble-group",
      root: "bubble",
      content: "bubble-content",
      reactions: "bubble-reactions",
    });
  });

  it("exports bubbleVariants cva", () => {
    expect(bubbleVariants({ variant: "default" })).toContain("group/bubble");
  });

  it("bubblePrimitiveMetadata is JSON-serializable", () => {
    const payload = bubblePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("BubbleSlot is a governed slot literal union", () => {
    expectTypeOf<BubbleSlot>().toEqualTypeOf<
      "bubble-group" | "bubble" | "bubble-content" | "bubble-reactions"
    >();
  });

  it("BubbleProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof BubbleProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
