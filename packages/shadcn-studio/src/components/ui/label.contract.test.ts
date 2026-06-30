import { describe, expect, expectTypeOf, it } from "vitest";
import {
  LABEL_PRIMITIVE_ID,
  LABEL_SLOTS,
  labelPrimitiveMetadata,
  labelRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./label.contract.js";
import type { LabelProps, LabelSlot } from "./label.js";

describe("label primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports LABEL_PRIMITIVE_ID for metadata registries", () => {
    expect(LABEL_PRIMITIVE_ID).toBe("shadcn-studio.ui.label");
  });

  it("exports LABEL_SLOTS", () => {
    expect(LABEL_SLOTS).toEqual({ root: "label" });
  });

  it("exports governed class constants", () => {
    expect(labelRootClassName).toContain("font-medium");
  });

  it("labelPrimitiveMetadata is JSON-serializable", () => {
    const payload = labelPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("LabelSlot is a governed slot literal union", () => {
    expectTypeOf<LabelSlot>().toEqualTypeOf<"label">();
  });

  it("LabelProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof LabelProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
