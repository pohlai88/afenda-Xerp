import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BG_SILK_PRIMITIVE_ID,
  BG_SILK_SLOTS,
  bgSilkPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "./bg-silk.contract.js";
import type { BgSilkSlot, SilkBackgroundProps } from "./bg-silk.js";

describe("bg-silk primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BG_SILK_PRIMITIVE_ID for metadata registries", () => {
    expect(BG_SILK_PRIMITIVE_ID).toBe("shadcn-studio.ui.bg-silk");
  });

  it("exports BG_SILK_SLOTS", () => {
    expect(BG_SILK_SLOTS).toEqual({ root: "bg-silk" });
  });

  it("bgSilkPrimitiveMetadata is JSON-serializable", () => {
    const payload = bgSilkPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("BgSilkSlot is a governed slot literal union", () => {
    expectTypeOf<BgSilkSlot>().toEqualTypeOf<"bg-silk">();
  });

  it("SilkBackgroundProps has no governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SilkBackgroundProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
