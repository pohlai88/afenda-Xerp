import { describe, expect, expectTypeOf, it } from "vitest";
import {
  FIELD_PRIMITIVE_ID,
  FIELD_SLOTS,
  fieldContentClassName,
  fieldPrimitiveMetadata,
  fieldVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/field.contract.js";
import type { FieldProps, FieldSlot } from "../../components-ui/field.js";

describe("field primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports FIELD_PRIMITIVE_ID for metadata registries", () => {
    expect(FIELD_PRIMITIVE_ID).toBe("shadcn-studio.ui.field");
  });

  it("exports FIELD_SLOTS", () => {
    expect(FIELD_SLOTS).toEqual({
      set: "field-set",
      legend: "field-legend",
      group: "field-group",
      root: "field",
      content: "field-content",
      label: "field-label",
      description: "field-description",
      separator: "field-separator",
      separatorContent: "field-separator-content",
      error: "field-error",
    });
  });

  it("exports fieldVariants cva and class constants", () => {
    expect(fieldVariants({ orientation: "vertical" })).toContain("group/field");
    expect(fieldContentClassName).toContain("flex-col");
  });

  it("fieldPrimitiveMetadata is JSON-serializable", () => {
    const payload = fieldPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("FieldSlot is a governed slot literal union", () => {
    expectTypeOf<FieldSlot>().toEqualTypeOf<
      | "field-set"
      | "field-legend"
      | "field-group"
      | "field"
      | "field-content"
      | "field-label"
      | "field-description"
      | "field-separator"
      | "field-separator-content"
      | "field-error"
    >();
  });

  it("FieldProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof FieldProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
