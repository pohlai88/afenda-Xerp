import { describe, expect, expectTypeOf, it } from "vitest";
import {
  ALERT_PRIMITIVE_ID,
  ALERT_SLOTS,
  alertPrimitiveMetadata,
  alertVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "./alert.contract.js";
import type { AlertProps, AlertSlot } from "./alert.js";

describe("alert primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports ALERT_PRIMITIVE_ID for metadata registries", () => {
    expect(ALERT_PRIMITIVE_ID).toBe("shadcn-studio.ui.alert");
  });

  it("exports ALERT_SLOTS", () => {
    expect(ALERT_SLOTS).toEqual({
      root: "alert",
      title: "alert-title",
      description: "alert-description",
      action: "alert-action",
    });
  });

  it("exports alertVariants cva", () => {
    expect(alertVariants({ variant: "default" })).toContain("group/alert");
  });

  it("alertPrimitiveMetadata is JSON-serializable", () => {
    const payload = alertPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("AlertSlot is a governed slot literal union", () => {
    expectTypeOf<AlertSlot>().toEqualTypeOf<
      "alert" | "alert-title" | "alert-description" | "alert-action"
    >();
  });

  it("AlertProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof AlertProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
