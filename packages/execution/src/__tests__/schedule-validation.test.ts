import { describe, expect, it } from "vitest";
import {
  resolveScheduleCron,
  SCHEDULE_CRON_PRESETS,
  validateScheduleDefinition,
} from "../index.js";

describe("schedule validation", () => {
  it("resolves preset cron expressions", () => {
    expect(
      resolveScheduleCron({
        scheduleId: "daily-report",
        scheduleKind: "daily",
        workflowId: "reports.daily",
      })
    ).toBe(SCHEDULE_CRON_PRESETS.daily);
  });

  it("requires cron expression for cron schedules", () => {
    expect(() =>
      resolveScheduleCron({
        scheduleId: "custom",
        scheduleKind: "cron",
        workflowId: "reports.custom",
      })
    ).toThrow("cron expression");
  });

  it("validates schedule definitions", () => {
    const schedule = validateScheduleDefinition({
      cron: "0 6 * * 1",
      scheduleId: "weekly-report",
      scheduleKind: "cron",
      workflowId: "reports.weekly",
    });

    expect(schedule.cron).toBe("0 6 * * 1");
  });

  it("rejects empty schedule identifiers", () => {
    expect(() =>
      validateScheduleDefinition({
        scheduleId: "",
        scheduleKind: "daily",
        workflowId: "reports.daily",
      })
    ).toThrow("scheduleId");
  });
});
