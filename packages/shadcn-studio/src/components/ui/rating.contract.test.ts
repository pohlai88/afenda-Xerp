import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  RATING_DEFAULTS,
  RATING_PRIMITIVE_ID,
  RATING_SLOTS,
  ratingPrimitiveMetadata,
  ratingRootClassName,
  ratingVariants,
} from "./rating.contract.js";
import type { RatingProps, RatingSlot } from "./rating.js";

describe("rating primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports RATING_PRIMITIVE_ID for metadata registries", () => {
    expect(RATING_PRIMITIVE_ID).toBe("shadcn-studio.ui.rating");
  });

  it("exports RATING_SLOTS", () => {
    expect(RATING_SLOTS).toEqual({
      root: "rating",
      star: "rating-star",
      item: "rating-item",
      input: "rating-input",
    });
  });

  it("exports governed class constants and cva", () => {
    expect(ratingRootClassName).toContain("focus-visible:ring-ring/50");
    expect(ratingVariants({ variant: "default" })).toContain("text-foreground");
    expect(RATING_DEFAULTS.maxStars).toBe(5);
  });

  it("ratingPrimitiveMetadata is JSON-serializable", () => {
    const payload = ratingPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("RatingSlot is a governed slot literal union", () => {
    expectTypeOf<RatingSlot>().toEqualTypeOf<
      "rating" | "rating-star" | "rating-item" | "rating-input"
    >();
  });

  it("RatingProps supports variant union and className", () => {
    expectTypeOf<RatingProps["variant"]>().toEqualTypeOf<
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "yellow"
      | null
      | undefined
    >();
    expectTypeOf<RatingProps["className"]>().toEqualTypeOf<
      string | undefined
    >();
  });
});
