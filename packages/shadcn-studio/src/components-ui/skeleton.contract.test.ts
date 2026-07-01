import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SKELETON_PRIMITIVE_ID,
  SKELETON_SLOTS,
  skeletonPrimitiveMetadata,
  skeletonRootClassName,
} from "./skeleton.contract.js";
import type { SkeletonProps, SkeletonSlot } from "./skeleton.js";

describe("skeleton primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SKELETON_PRIMITIVE_ID for metadata registries", () => {
    expect(SKELETON_PRIMITIVE_ID).toBe("shadcn-studio.ui.skeleton");
  });

  it("exports SKELETON_SLOTS", () => {
    expect(SKELETON_SLOTS).toEqual({ root: "skeleton" });
  });

  it("exports governed class constants", () => {
    expect(skeletonRootClassName).toContain("animate-pulse");
  });

  it("skeletonPrimitiveMetadata is JSON-serializable", () => {
    const payload = skeletonPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SkeletonSlot is a governed slot literal union", () => {
    expectTypeOf<SkeletonSlot>().toEqualTypeOf<"skeleton">();
  });

  it("SkeletonProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SkeletonProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
