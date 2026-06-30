import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  TEXTAREA_PRIMITIVE_ID,
  TEXTAREA_SLOTS,
  textareaPrimitiveMetadata,
  textareaRootClassName,
} from "./textarea.contract.js";
import type { TextareaProps, TextareaSlot } from "./textarea.js";

describe("textarea primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports TEXTAREA_PRIMITIVE_ID for metadata registries", () => {
    expect(TEXTAREA_PRIMITIVE_ID).toBe("shadcn-studio.ui.textarea");
  });

  it("exports TEXTAREA_SLOTS", () => {
    expect(TEXTAREA_SLOTS).toEqual({ root: "textarea" });
  });

  it("exports governed class constants", () => {
    expect(textareaRootClassName).toContain("border-input");
  });

  it("textareaPrimitiveMetadata is JSON-serializable", () => {
    const payload = textareaPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("TextareaSlot is a governed slot literal union", () => {
    expectTypeOf<TextareaSlot>().toEqualTypeOf<"textarea">();
  });

  it("TextareaProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof TextareaProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
