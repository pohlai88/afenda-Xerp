import { describe, expect, expectTypeOf, it } from "vitest";
import {
  COMBOBOX_PRIMITIVE_ID,
  COMBOBOX_SLOTS,
  comboboxContentClassName,
  comboboxPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "./combobox.contract.js";
import type {
  ComboboxContentProps,
  ComboboxSlot,
  ComboboxTriggerProps,
} from "./combobox.js";

describe("combobox primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports COMBOBOX_PRIMITIVE_ID for metadata registries", () => {
    expect(COMBOBOX_PRIMITIVE_ID).toBe("shadcn-studio.ui.combobox");
  });

  it("exports COMBOBOX_SLOTS with portal and item indicator", () => {
    expect(COMBOBOX_SLOTS.portal).toBe("combobox-portal");
    expect(COMBOBOX_SLOTS.itemIndicator).toBe("combobox-item-indicator");
  });

  it("exports governed class constants", () => {
    expect(comboboxContentClassName).toContain("bg-popover");
  });

  it("comboboxPrimitiveMetadata is JSON-serializable", () => {
    const payload = comboboxPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ComboboxSlot is a governed slot literal union", () => {
    expectTypeOf<ComboboxSlot>().toEqualTypeOf<
      (typeof COMBOBOX_SLOTS)[keyof typeof COMBOBOX_SLOTS]
    >();
  });

  it("ComboboxTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ComboboxTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("ComboboxContentProps.side defaults in adapter", () => {
    expectTypeOf<ComboboxContentProps["side"]>().toEqualTypeOf<
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "inline-start"
      | "inline-end"
      | undefined
    >();
  });
});
