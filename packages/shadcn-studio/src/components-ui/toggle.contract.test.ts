import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  TOGGLE_PRIMITIVE_ID,
  TOGGLE_SLOTS,
  togglePrimitiveMetadata,
  toggleVariants,
} from "./toggle.contract.js";
import type { ToggleProps, ToggleSlot } from "./toggle.js";

describe("toggle primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports TOGGLE_PRIMITIVE_ID for metadata registries", () => {
    expect(TOGGLE_PRIMITIVE_ID).toBe("shadcn-studio.ui.toggle");
  });

  it("exports TOGGLE_SLOTS", () => {
    expect(TOGGLE_SLOTS).toEqual({ root: "toggle" });
  });

  it("exports toggleVariants cva", () => {
    expect(toggleVariants({ variant: "default", size: "default" })).toContain(
      "group/toggle"
    );
  });

  it("togglePrimitiveMetadata is JSON-serializable", () => {
    const payload = togglePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ToggleSlot is a governed slot literal union", () => {
    expectTypeOf<ToggleSlot>().toEqualTypeOf<"toggle">();
  });

  it("ToggleProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ToggleProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
