import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BACKGROUND_RIPPLE_PRIMITIVE_ID,
  BACKGROUND_RIPPLE_SLOTS,
  backgroundRipplePrimitiveMetadata,
  backgroundRippleRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./background-ripple.contract.js";
import type {
  BackgroundRippleEffectProps,
  BackgroundRippleSlot,
} from "./background-ripple.js";

describe("background-ripple primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BACKGROUND_RIPPLE_PRIMITIVE_ID for metadata registries", () => {
    expect(BACKGROUND_RIPPLE_PRIMITIVE_ID).toBe(
      "shadcn-studio.ui.background-ripple"
    );
  });

  it("exports BACKGROUND_RIPPLE_SLOTS", () => {
    expect(BACKGROUND_RIPPLE_SLOTS).toEqual({
      root: "background-ripple",
      inner: "background-ripple-inner",
      overlay: "background-ripple-overlay",
      grid: "background-ripple-grid",
      cell: "background-ripple-cell",
    });
  });

  it("exports backgroundRippleRootClassName", () => {
    expect(backgroundRippleRootClassName).toContain("[--cell-fill-color");
  });

  it("backgroundRipplePrimitiveMetadata is JSON-serializable", () => {
    const payload = backgroundRipplePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("BackgroundRippleSlot is a governed slot literal union", () => {
    expectTypeOf<BackgroundRippleSlot>().toEqualTypeOf<
      | "background-ripple"
      | "background-ripple-inner"
      | "background-ripple-overlay"
      | "background-ripple-grid"
      | "background-ripple-cell"
    >();
  });

  it("BackgroundRippleEffectProps has no governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof BackgroundRippleEffectProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
