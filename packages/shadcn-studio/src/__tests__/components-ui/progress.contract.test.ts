import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  PROGRESS_PRIMITIVE_ID,
  PROGRESS_SLOTS,
  progressIndicatorClassName,
  progressPrimitiveMetadata,
  progressRootClassName,
  progressTrackClassName,
} from "../../components-ui/progress.contract.js";
import type {
  ProgressProps,
  ProgressSlot,
} from "../../components-ui/progress.js";

describe("progress primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports PROGRESS_PRIMITIVE_ID for metadata registries", () => {
    expect(PROGRESS_PRIMITIVE_ID).toBe("shadcn-studio.ui.progress");
  });

  it("exports PROGRESS_SLOTS", () => {
    expect(PROGRESS_SLOTS).toEqual({
      root: "progress",
      track: "progress-track",
      indicator: "progress-indicator",
      label: "progress-label",
      value: "progress-value",
    });
  });

  it("exports governed class constants", () => {
    expect(progressRootClassName).toContain("flex");
    expect(progressTrackClassName).toContain("bg-muted");
    expect(progressIndicatorClassName).toContain("bg-primary");
  });

  it("progressPrimitiveMetadata is JSON-serializable", () => {
    const payload = progressPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ProgressSlot is a governed slot literal union", () => {
    expectTypeOf<ProgressSlot>().toEqualTypeOf<
      | "progress"
      | "progress-track"
      | "progress-indicator"
      | "progress-label"
      | "progress-value"
    >();
  });

  it("ProgressProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ProgressProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
