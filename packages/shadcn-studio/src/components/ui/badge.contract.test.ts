import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BADGE_PRIMITIVE_ID,
  BADGE_SLOTS,
  badgePrimitiveMetadata,
  badgeVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "./badge.contract.js";
import type { BadgeProps, BadgeSlot } from "./badge.js";

describe("badge primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BADGE_PRIMITIVE_ID for metadata registries", () => {
    expect(BADGE_PRIMITIVE_ID).toBe("shadcn-studio.ui.badge");
  });

  it("exports BADGE_SLOTS", () => {
    expect(BADGE_SLOTS).toEqual({ root: "badge" });
  });

  it("exports badgeVariants cva", () => {
    expect(badgeVariants({ variant: "default" })).toContain("group/badge");
  });

  it("badgePrimitiveMetadata is JSON-serializable", () => {
    const payload = badgePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("BadgeSlot is a governed slot literal union", () => {
    expectTypeOf<BadgeSlot>().toEqualTypeOf<"badge">();
  });

  it("BadgeProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof BadgeProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
