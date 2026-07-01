import { describe, expect, expectTypeOf, it } from "vitest";
import {
  KBD_PRIMITIVE_ID,
  KBD_SLOTS,
  kbdGroupClassName,
  kbdPrimitiveMetadata,
  kbdRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./kbd.contract.js";
import type { KbdProps, KbdSlot } from "./kbd.js";

describe("kbd primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports KBD_PRIMITIVE_ID for metadata registries", () => {
    expect(KBD_PRIMITIVE_ID).toBe("shadcn-studio.ui.kbd");
  });

  it("exports KBD_SLOTS", () => {
    expect(KBD_SLOTS).toEqual({ root: "kbd", group: "kbd-group" });
  });

  it("exports governed class constants", () => {
    expect(kbdRootClassName).toContain("bg-muted");
    expect(kbdGroupClassName).toContain("inline-flex");
  });

  it("kbdPrimitiveMetadata is JSON-serializable", () => {
    const payload = kbdPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("KbdSlot is a governed slot literal union", () => {
    expectTypeOf<KbdSlot>().toEqualTypeOf<"kbd" | "kbd-group">();
  });

  it("KbdProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof KbdProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
