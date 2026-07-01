import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SEPARATOR_PRIMITIVE_ID,
  SEPARATOR_SLOTS,
  separatorPrimitiveMetadata,
  separatorRootClassName,
} from "./separator.contract.js";
import type { SeparatorProps, SeparatorSlot } from "./separator.js";

describe("separator primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SEPARATOR_PRIMITIVE_ID for metadata registries", () => {
    expect(SEPARATOR_PRIMITIVE_ID).toBe("shadcn-studio.ui.separator");
  });

  it("exports SEPARATOR_SLOTS", () => {
    expect(SEPARATOR_SLOTS).toEqual({ root: "separator" });
  });

  it("exports governed class constants", () => {
    expect(separatorRootClassName).toContain("bg-border");
  });

  it("separatorPrimitiveMetadata is JSON-serializable", () => {
    const payload = separatorPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SeparatorSlot is a governed slot literal union", () => {
    expectTypeOf<SeparatorSlot>().toEqualTypeOf<"separator">();
  });

  it("SeparatorProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SeparatorProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
