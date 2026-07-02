import { describe, expect, expectTypeOf, it } from "vitest";
import {
  MARKER_PRIMITIVE_ID,
  MARKER_SLOTS,
  markerContentClassName,
  markerIconClassName,
  markerPrimitiveMetadata,
  markerVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/marker.contract.js";
import type { MarkerProps, MarkerSlot } from "../../components-ui/marker.js";

describe("marker primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports MARKER_PRIMITIVE_ID for metadata registries", () => {
    expect(MARKER_PRIMITIVE_ID).toBe("shadcn-studio.ui.marker");
  });

  it("exports MARKER_SLOTS", () => {
    expect(MARKER_SLOTS).toEqual({
      root: "marker",
      icon: "marker-icon",
      content: "marker-content",
    });
  });

  it("exports markerVariants cva and class constants", () => {
    expect(markerVariants({ variant: "default" })).toContain("group/marker");
    expect(markerIconClassName).toContain("shrink-0");
    expect(markerContentClassName).toContain("min-w-0");
  });

  it("markerPrimitiveMetadata is JSON-serializable", () => {
    const payload = markerPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("MarkerSlot is a governed slot literal union", () => {
    expectTypeOf<MarkerSlot>().toEqualTypeOf<
      "marker" | "marker-icon" | "marker-content"
    >();
  });

  it("MarkerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof MarkerProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
