import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CALENDAR_PRIMITIVE_ID,
  CALENDAR_SLOTS,
  calendarPrimitiveMetadata,
  calendarRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./calendar.contract.js";
import type {
  CalendarDayButtonProps,
  CalendarProps,
  CalendarSlot,
} from "./calendar.js";

describe("calendar primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CALENDAR_PRIMITIVE_ID for metadata registries", () => {
    expect(CALENDAR_PRIMITIVE_ID).toBe("shadcn-studio.ui.calendar");
  });

  it("exports CALENDAR_SLOTS", () => {
    expect(CALENDAR_SLOTS).toEqual({
      root: "calendar",
      weekNumber: "calendar-week-number",
    });
  });

  it("exports governed class constants", () => {
    expect(calendarRootClassName).toContain("group/calendar");
  });

  it("calendarPrimitiveMetadata is JSON-serializable", () => {
    const payload = calendarPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CalendarSlot is a governed slot literal union", () => {
    expectTypeOf<CalendarSlot>().toEqualTypeOf<
      "calendar" | "calendar-week-number"
    >();
  });

  it("CalendarProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CalendarProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("CalendarDayButtonProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CalendarDayButtonProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
