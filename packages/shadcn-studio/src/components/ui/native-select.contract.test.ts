import { describe, expect, expectTypeOf, it } from "vitest";
import {
  NATIVE_SELECT_PRIMITIVE_ID,
  NATIVE_SELECT_SLOTS,
  nativeSelectClassName,
  nativeSelectIconClassName,
  nativeSelectPrimitiveMetadata,
  nativeSelectWrapperClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./native-select.contract.js";
import type { NativeSelectProps, NativeSelectSlot } from "./native-select.js";

describe("native-select primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports NATIVE_SELECT_PRIMITIVE_ID for metadata registries", () => {
    expect(NATIVE_SELECT_PRIMITIVE_ID).toBe("shadcn-studio.ui.native-select");
  });

  it("exports NATIVE_SELECT_SLOTS with wrapper, select, and icon", () => {
    expect(NATIVE_SELECT_SLOTS).toEqual({
      wrapper: "native-select-wrapper",
      select: "native-select",
      icon: "native-select-icon",
      option: "native-select-option",
      optGroup: "native-select-optgroup",
    });
  });

  it("exports governed class constants", () => {
    expect(nativeSelectWrapperClassName).toContain("group/native-select");
    expect(nativeSelectClassName).toContain("border-input");
    expect(nativeSelectIconClassName).toContain("pointer-events-none");
  });

  it("nativeSelectPrimitiveMetadata is JSON-serializable", () => {
    const payload = nativeSelectPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("NativeSelectSlot is a governed slot literal union", () => {
    expectTypeOf<NativeSelectSlot>().toEqualTypeOf<
      | "native-select-wrapper"
      | "native-select"
      | "native-select-icon"
      | "native-select-option"
      | "native-select-optgroup"
    >();
  });

  it("NativeSelectProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof NativeSelectProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
