import { describe, expect, expectTypeOf, it } from "vitest";
import {
  DIRECTION_PRIMITIVE_ID,
  DIRECTION_SLOTS,
  directionPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/direction.contract.js";
import type {
  DirectionProviderProps,
  DirectionSlot,
} from "../../components-ui/direction.js";

describe("direction primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports DIRECTION_PRIMITIVE_ID for metadata registries", () => {
    expect(DIRECTION_PRIMITIVE_ID).toBe("shadcn-studio.ui.direction");
  });

  it("exports DIRECTION_SLOTS", () => {
    expect(DIRECTION_SLOTS).toEqual({ provider: "direction-provider" });
  });

  it("directionPrimitiveMetadata is JSON-serializable", () => {
    const payload = directionPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("DirectionSlot is a governed slot literal union", () => {
    expectTypeOf<DirectionSlot>().toEqualTypeOf<"direction-provider">();
  });

  it("DirectionProviderProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof DirectionProviderProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
