import { describe, expect, expectTypeOf, it } from "vitest";
import {
  NUMBER_TICKER_PRIMITIVE_ID,
  NUMBER_TICKER_SLOTS,
  numberTickerPrimitiveMetadata,
  numberTickerRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/number-ticker.contract.js";
import type {
  NumberTickerProps,
  NumberTickerSlot,
} from "../../components-ui/number-ticker.js";

describe("number-ticker primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports NUMBER_TICKER_PRIMITIVE_ID for metadata registries", () => {
    expect(NUMBER_TICKER_PRIMITIVE_ID).toBe("shadcn-studio.ui.number-ticker");
  });

  it("exports NUMBER_TICKER_SLOTS", () => {
    expect(NUMBER_TICKER_SLOTS).toEqual({ root: "number-ticker" });
  });

  it("exports governed class constants", () => {
    expect(numberTickerRootClassName).toContain("tabular-nums");
  });

  it("numberTickerPrimitiveMetadata is JSON-serializable", () => {
    const payload = numberTickerPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
    expect(payload.vendorNotes).toBe("motion/react");
  });

  it("NumberTickerSlot is a governed slot literal union", () => {
    expectTypeOf<NumberTickerSlot>().toEqualTypeOf<"number-ticker">();
  });

  it("NumberTickerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof NumberTickerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
