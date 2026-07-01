import { describe, expect, expectTypeOf, it } from "vitest";
import {
  ASPECT_RATIO_PRIMITIVE_ID,
  ASPECT_RATIO_SLOTS,
  aspectRatioPrimitiveMetadata,
  aspectRatioRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./aspect-ratio.contract.js";
import type { AspectRatioProps, AspectRatioSlot } from "./aspect-ratio.js";

describe("aspect-ratio primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports ASPECT_RATIO_PRIMITIVE_ID for metadata registries", () => {
    expect(ASPECT_RATIO_PRIMITIVE_ID).toBe("shadcn-studio.ui.aspect-ratio");
  });

  it("exports ASPECT_RATIO_SLOTS", () => {
    expect(ASPECT_RATIO_SLOTS).toEqual({ root: "aspect-ratio" });
  });

  it("exports aspectRatioRootClassName", () => {
    expect(aspectRatioRootClassName).toContain("aspect-(--ratio)");
  });

  it("aspectRatioPrimitiveMetadata is JSON-serializable", () => {
    const payload = aspectRatioPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("AspectRatioSlot is a governed slot literal union", () => {
    expectTypeOf<AspectRatioSlot>().toEqualTypeOf<"aspect-ratio">();
  });

  it("AspectRatioProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof AspectRatioProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
