import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BG_DOT_GRID_PRIMITIVE_ID,
  BG_DOT_GRID_SLOTS,
  bgDotGridPrimitiveMetadata,
  bgDotGridRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./bg-dot-grid.contract.js";
import type { BgDotGridSlot, DotGridProps } from "./bg-dot-grid.js";

describe("bg-dot-grid primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BG_DOT_GRID_PRIMITIVE_ID for metadata registries", () => {
    expect(BG_DOT_GRID_PRIMITIVE_ID).toBe("shadcn-studio.ui.bg-dot-grid");
  });

  it("exports BG_DOT_GRID_SLOTS", () => {
    expect(BG_DOT_GRID_SLOTS).toEqual({ root: "bg-dot-grid" });
  });

  it("exports bgDotGridRootClassName", () => {
    expect(bgDotGridRootClassName).toContain("absolute inset-0");
  });

  it("bgDotGridPrimitiveMetadata is JSON-serializable", () => {
    const payload = bgDotGridPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("BgDotGridSlot is a governed slot literal union", () => {
    expectTypeOf<BgDotGridSlot>().toEqualTypeOf<"bg-dot-grid">();
  });

  it("DotGridProps has no governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof DotGridProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
