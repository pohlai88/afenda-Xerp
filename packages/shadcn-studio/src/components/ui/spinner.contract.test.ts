import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SPINNER_PRIMITIVE_ID,
  SPINNER_SLOTS,
  spinnerPrimitiveMetadata,
  spinnerRootClassName,
} from "./spinner.contract.js";
import type { SpinnerProps, SpinnerSlot } from "./spinner.js";

describe("spinner primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SPINNER_PRIMITIVE_ID for metadata registries", () => {
    expect(SPINNER_PRIMITIVE_ID).toBe("shadcn-studio.ui.spinner");
  });

  it("exports SPINNER_SLOTS", () => {
    expect(SPINNER_SLOTS).toEqual({ root: "spinner" });
  });

  it("exports governed class constants", () => {
    expect(spinnerRootClassName).toContain("animate-spin");
  });

  it("spinnerPrimitiveMetadata is JSON-serializable", () => {
    const payload = spinnerPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SpinnerSlot is a governed slot literal union", () => {
    expectTypeOf<SpinnerSlot>().toEqualTypeOf<"spinner">();
  });

  it("SpinnerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SpinnerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
