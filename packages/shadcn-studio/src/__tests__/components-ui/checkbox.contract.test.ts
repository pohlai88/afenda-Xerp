import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CHECKBOX_PRIMITIVE_ID,
  CHECKBOX_SLOTS,
  checkboxIndicatorClassName,
  checkboxPrimitiveMetadata,
  checkboxRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/checkbox.contract.js";
import type {
  CheckboxProps,
  CheckboxSlot,
} from "../../components-ui/checkbox.js";

describe("checkbox primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CHECKBOX_PRIMITIVE_ID for metadata registries", () => {
    expect(CHECKBOX_PRIMITIVE_ID).toBe("shadcn-studio.ui.checkbox");
  });

  it("exports CHECKBOX_SLOTS", () => {
    expect(CHECKBOX_SLOTS).toEqual({
      root: "checkbox",
      indicator: "checkbox-indicator",
    });
  });

  it("exports governed class constants", () => {
    expect(checkboxRootClassName).toContain("border-input");
    expect(checkboxIndicatorClassName).toContain("place-content-center");
  });

  it("checkboxPrimitiveMetadata is JSON-serializable", () => {
    const payload = checkboxPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CheckboxSlot is a governed slot literal union", () => {
    expectTypeOf<CheckboxSlot>().toEqualTypeOf<
      "checkbox" | "checkbox-indicator"
    >();
  });

  it("CheckboxProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CheckboxProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
