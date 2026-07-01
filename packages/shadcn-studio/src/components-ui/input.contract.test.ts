import { describe, expect, expectTypeOf, it } from "vitest";
import {
  INPUT_PRIMITIVE_ID,
  INPUT_SLOTS,
  inputPrimitiveMetadata,
  inputRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./input.contract.js";
import type { InputProps, InputSlot } from "./input.js";

describe("input primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports INPUT_PRIMITIVE_ID for metadata registries", () => {
    expect(INPUT_PRIMITIVE_ID).toBe("shadcn-studio.ui.input");
  });

  it("exports INPUT_SLOTS", () => {
    expect(INPUT_SLOTS).toEqual({ root: "input" });
  });

  it("exports governed class constants", () => {
    expect(inputRootClassName).toContain("border-input");
  });

  it("inputPrimitiveMetadata is JSON-serializable", () => {
    const payload = inputPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("InputSlot is a governed slot literal union", () => {
    expectTypeOf<InputSlot>().toEqualTypeOf<"input">();
  });

  it("InputProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof InputProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
