import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SLIDER_PRIMITIVE_ID,
  SLIDER_SLOTS,
  sliderControlClassName,
  sliderPrimitiveMetadata,
  sliderRootClassName,
} from "./slider.contract.js";
import type { SliderProps, SliderSlot } from "./slider.js";

describe("slider primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SLIDER_PRIMITIVE_ID for metadata registries", () => {
    expect(SLIDER_PRIMITIVE_ID).toBe("shadcn-studio.ui.slider");
  });

  it("exports SLIDER_SLOTS", () => {
    expect(SLIDER_SLOTS).toEqual({
      root: "slider",
      control: "slider-control",
      track: "slider-track",
      range: "slider-range",
      thumb: "slider-thumb",
    });
  });

  it("exports governed class constants", () => {
    expect(sliderRootClassName).toContain("data-horizontal:w-full");
    expect(sliderControlClassName).toContain("touch-none");
  });

  it("sliderPrimitiveMetadata is JSON-serializable", () => {
    const payload = sliderPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SliderSlot is a governed slot literal union", () => {
    expectTypeOf<SliderSlot>().toEqualTypeOf<
      | "slider"
      | "slider-control"
      | "slider-track"
      | "slider-range"
      | "slider-thumb"
    >();
  });

  it("SliderProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SliderProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
