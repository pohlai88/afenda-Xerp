import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  TIMELINE_PRIMITIVE_ID,
  TIMELINE_SLOTS,
  timelineDotVariants,
  timelineItemVariants,
  timelinePrimitiveMetadata,
  timelineVariants,
} from "./timeline.contract.js";
import type { TimelineProps, TimelineSlot } from "./timeline.js";

describe("timeline primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports TIMELINE_PRIMITIVE_ID for metadata registries", () => {
    expect(TIMELINE_PRIMITIVE_ID).toBe("shadcn-studio.ui.timeline");
  });

  it("exports TIMELINE_SLOTS", () => {
    expect(TIMELINE_SLOTS).toEqual({
      root: "timeline",
      item: "timeline-item",
      dot: "timeline-dot",
      tag: "timeline-tag",
      content: "timeline-content",
      heading: "timeline-heading",
      line: "timeline-line",
    });
  });

  it("exports governed cva variants", () => {
    expect(timelineVariants({ positions: "left" })).toContain("grid");
    expect(timelineItemVariants({ status: "done" })).toContain("text-primary");
    expect(timelineDotVariants({ status: "error" })).toContain(
      "border-destructive"
    );
  });

  it("timelinePrimitiveMetadata is JSON-serializable", () => {
    const payload = timelinePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("TimelineSlot is a governed slot literal union", () => {
    expectTypeOf<TimelineSlot>().toEqualTypeOf<
      | "timeline"
      | "timeline-item"
      | "timeline-dot"
      | "timeline-tag"
      | "timeline-content"
      | "timeline-heading"
      | "timeline-line"
    >();
  });

  it("TimelineProps supports positions variant and className", () => {
    expectTypeOf<TimelineProps["positions"]>().toEqualTypeOf<
      "left" | "right" | "center" | null | undefined
    >();
    expectTypeOf<TimelineProps["className"]>().toEqualTypeOf<
      string | undefined
    >();
  });
});
