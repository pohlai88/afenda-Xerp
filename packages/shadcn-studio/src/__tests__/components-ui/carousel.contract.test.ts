import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CAROUSEL_PRIMITIVE_ID,
  CAROUSEL_SLOTS,
  carouselPrimitiveMetadata,
  carouselRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/carousel.contract.js";
import type {
  CarouselRootProps,
  CarouselSlot,
} from "../../components-ui/carousel.js";

describe("carousel primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CAROUSEL_PRIMITIVE_ID for metadata registries", () => {
    expect(CAROUSEL_PRIMITIVE_ID).toBe("shadcn-studio.ui.carousel");
  });

  it("exports CAROUSEL_SLOTS", () => {
    expect(CAROUSEL_SLOTS).toEqual({
      root: "carousel",
      content: "carousel-content",
      item: "carousel-item",
      previous: "carousel-previous",
      next: "carousel-next",
    });
  });

  it("exports governed class constants", () => {
    expect(carouselRootClassName).toBe("relative");
  });

  it("carouselPrimitiveMetadata is JSON-serializable", () => {
    const payload = carouselPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CarouselSlot is a governed slot literal union", () => {
    expectTypeOf<CarouselSlot>().toEqualTypeOf<
      | "carousel"
      | "carousel-content"
      | "carousel-item"
      | "carousel-previous"
      | "carousel-next"
    >();
  });

  it("CarouselRootProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CarouselRootProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
