import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CARD_PRIMITIVE_ID,
  CARD_SLOTS,
  cardPrimitiveMetadata,
  cardRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./card.contract.js";
import type { CardProps, CardSlot } from "./card.js";

describe("card primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CARD_PRIMITIVE_ID for metadata registries", () => {
    expect(CARD_PRIMITIVE_ID).toBe("shadcn-studio.ui.card");
  });

  it("exports CARD_SLOTS", () => {
    expect(CARD_SLOTS).toEqual({
      root: "card",
      header: "card-header",
      title: "card-title",
      description: "card-description",
      action: "card-action",
      content: "card-content",
      footer: "card-footer",
    });
  });

  it("exports governed class constants", () => {
    expect(cardRootClassName).toContain("bg-card");
  });

  it("cardPrimitiveMetadata is JSON-serializable", () => {
    const payload = cardPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CardSlot is a governed slot literal union", () => {
    expectTypeOf<CardSlot>().toEqualTypeOf<
      | "card"
      | "card-header"
      | "card-title"
      | "card-description"
      | "card-action"
      | "card-content"
      | "card-footer"
    >();
  });

  it("CardProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CardProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
