import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SCROLL_AREA_PRIMITIVE_ID,
  SCROLL_AREA_SLOTS,
  scrollAreaPrimitiveMetadata,
  scrollAreaRootClassName,
  scrollAreaViewportClassName,
} from "../../components-ui/scroll-area.contract.js";
import type {
  ScrollAreaProps,
  ScrollAreaSlot,
} from "../../components-ui/scroll-area.js";

describe("scroll-area primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SCROLL_AREA_PRIMITIVE_ID for metadata registries", () => {
    expect(SCROLL_AREA_PRIMITIVE_ID).toBe("shadcn-studio.ui.scroll-area");
  });

  it("exports SCROLL_AREA_SLOTS", () => {
    expect(SCROLL_AREA_SLOTS).toEqual({
      root: "scroll-area",
      viewport: "scroll-area-viewport",
      scrollbar: "scroll-area-scrollbar",
      thumb: "scroll-area-thumb",
      corner: "scroll-area-corner",
    });
  });

  it("exports governed class constants", () => {
    expect(scrollAreaRootClassName).toBe("relative");
    expect(scrollAreaViewportClassName).toContain("focus-visible:ring-ring/50");
  });

  it("scrollAreaPrimitiveMetadata is JSON-serializable", () => {
    const payload = scrollAreaPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ScrollAreaSlot is a governed slot literal union", () => {
    expectTypeOf<ScrollAreaSlot>().toEqualTypeOf<
      | "scroll-area"
      | "scroll-area-viewport"
      | "scroll-area-scrollbar"
      | "scroll-area-thumb"
      | "scroll-area-corner"
    >();
  });

  it("ScrollAreaProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ScrollAreaProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
