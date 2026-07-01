import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SWITCH_PRIMITIVE_ID,
  SWITCH_SLOTS,
  switchOutline06PrimaryClassName,
  switchOutlineRootClassName,
  switchOutlineThumbClassName,
  switchPrimitiveMetadata,
  switchRootClassName,
  switchSemanticSuccessClassName,
  switchThumbClassName,
  switchThumbMotionClassName,
} from "./switch.contract.js";
import type { SwitchProps, SwitchSlot } from "./switch.js";

describe("switch primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SWITCH_PRIMITIVE_ID for metadata registries", () => {
    expect(SWITCH_PRIMITIVE_ID).toBe("shadcn-studio.ui.switch");
  });

  it("exports SWITCH_SLOTS", () => {
    expect(SWITCH_SLOTS).toEqual({
      root: "switch",
      thumb: "switch-thumb",
    });
  });

  it("exports governed class constants", () => {
    expect(switchRootClassName).toContain("group/switch");
    expect(switchThumbClassName).toContain("rounded-full");
    expect(switchOutline06PrimaryClassName).toContain(
      "data-checked:[&_span]:bg-primary"
    );
    expect(switchOutline06PrimaryClassName).toContain("data-checked:bg-transparent");
    expect(switchOutlineRootClassName).toBe(switchOutline06PrimaryClassName);
    expect(switchOutlineThumbClassName).toBe(switchThumbMotionClassName);
    expect(switchSemanticSuccessClassName).toContain(
      "dark:data-checked:[&_span]:bg-green-400"
    );
  });

  it("switchPrimitiveMetadata includes variant axis", () => {
    expect(switchPrimitiveMetadata().variants).toEqual(["default", "outline"]);
  });

  it("switchPrimitiveMetadata is JSON-serializable", () => {
    const payload = switchPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SwitchSlot is a governed slot literal union", () => {
    expectTypeOf<SwitchSlot>().toEqualTypeOf<"switch" | "switch-thumb">();
  });

  it("SwitchProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SwitchProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
