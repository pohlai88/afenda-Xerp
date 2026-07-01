import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CIRCULAR_PROGRESS_PRIMITIVE_ID,
  CIRCULAR_PROGRESS_SLOTS,
  circularProgressPrimitiveMetadata,
  circularProgressRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./circular-progress.contract.js";
import type {
  CircularProgressProps,
  CircularProgressSlot,
} from "./circular-progress.js";

describe("circular-progress primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CIRCULAR_PROGRESS_PRIMITIVE_ID for metadata registries", () => {
    expect(CIRCULAR_PROGRESS_PRIMITIVE_ID).toBe(
      "shadcn-studio.ui.circular-progress"
    );
  });

  it("exports CIRCULAR_PROGRESS_SLOTS", () => {
    expect(CIRCULAR_PROGRESS_SLOTS).toEqual({
      root: "circular-progress",
      label: "circular-progress-label",
    });
  });

  it("exports governed class constants", () => {
    expect(circularProgressRootClassName).toContain("relative");
  });

  it("circularProgressPrimitiveMetadata is JSON-serializable", () => {
    const payload = circularProgressPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CircularProgressSlot is a governed slot literal union", () => {
    expectTypeOf<CircularProgressSlot>().toEqualTypeOf<
      "circular-progress" | "circular-progress-label"
    >();
  });

  it("CircularProgressProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CircularProgressProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
