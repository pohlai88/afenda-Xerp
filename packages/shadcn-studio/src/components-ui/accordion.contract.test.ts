import { describe, expect, expectTypeOf, it } from "vitest";
import {
  ACCORDION_PRIMITIVE_ID,
  ACCORDION_SLOTS,
  accordionContentPanelClassName,
  accordionHeaderClassName,
  accordionPrimitiveMetadata,
  accordionRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./accordion.contract.js";
import type {
  AccordionContentProps,
  AccordionProps,
  AccordionSlot,
} from "./accordion.js";

describe("accordion primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports ACCORDION_PRIMITIVE_ID for metadata registries", () => {
    expect(ACCORDION_PRIMITIVE_ID).toBe("shadcn-studio.ui.accordion");
  });

  it("exports ACCORDION_SLOTS", () => {
    expect(ACCORDION_SLOTS).toEqual({
      root: "accordion",
      item: "accordion-item",
      header: "accordion-header",
      trigger: "accordion-trigger",
      triggerIcon: "accordion-trigger-icon",
      content: "accordion-content",
      contentInner: "accordion-content-inner",
    });
  });

  it("exports governed header and panel class constants", () => {
    expect(accordionHeaderClassName).toBe("flex");
    expect(accordionRootClassName).toContain("flex");
    expect(accordionContentPanelClassName).toContain(
      "var(--accordion-panel-height)"
    );
  });

  it("accordionPrimitiveMetadata is JSON-serializable", () => {
    const payload = accordionPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("AccordionSlot is a governed slot literal union", () => {
    expectTypeOf<AccordionSlot>().toEqualTypeOf<
      | "accordion"
      | "accordion-item"
      | "accordion-header"
      | "accordion-trigger"
      | "accordion-trigger-icon"
      | "accordion-content"
      | "accordion-content-inner"
    >();
  });

  it("AccordionContentProps.innerClassName is string-only", () => {
    expectTypeOf<AccordionContentProps["innerClassName"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  it("AccordionProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof AccordionProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
