import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BORDER_BEAM_PRIMITIVE_ID,
  BORDER_BEAM_SLOTS,
  borderBeamBeamClassName,
  borderBeamPrimitiveMetadata,
  borderBeamRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/border-beam.contract.js";
import type {
  BorderBeamProps,
  BorderBeamSlot,
} from "../../components-ui/border-beam.js";

describe("border-beam primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BORDER_BEAM_PRIMITIVE_ID for metadata registries", () => {
    expect(BORDER_BEAM_PRIMITIVE_ID).toBe("shadcn-studio.ui.border-beam");
  });

  it("exports BORDER_BEAM_SLOTS", () => {
    expect(BORDER_BEAM_SLOTS).toEqual({
      root: "border-beam",
      beam: "border-beam-beam",
    });
  });

  it("exports governed class constants", () => {
    expect(borderBeamRootClassName).toContain("mask-intersect");
    expect(borderBeamBeamClassName).toContain("bg-linear-to-l");
  });

  it("borderBeamPrimitiveMetadata is JSON-serializable", () => {
    const payload = borderBeamPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("BorderBeamSlot is a governed slot literal union", () => {
    expectTypeOf<BorderBeamSlot>().toEqualTypeOf<
      "border-beam" | "border-beam-beam"
    >();
  });

  it("BorderBeamProps has no governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof BorderBeamProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
