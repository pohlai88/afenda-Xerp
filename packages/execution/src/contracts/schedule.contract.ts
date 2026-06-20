export const SCHEDULE_KINDS = ["daily", "weekly", "monthly", "cron"] as const;

export type ScheduleKind = (typeof SCHEDULE_KINDS)[number];

export const SCHEDULE_CRON_PRESETS: Readonly<
  Record<Exclude<ScheduleKind, "cron">, string>
> = {
  daily: "0 0 * * *",
  monthly: "0 0 1 * *",
  weekly: "0 0 * * 0",
};

export interface ScheduleDefinition {
  readonly cron?: string;
  readonly deduplicationKey?: string;
  readonly scheduleId: string;
  readonly scheduleKind: ScheduleKind;
  readonly timezone?: string;
  readonly workflowId: string;
}

export function resolveScheduleCron(schedule: ScheduleDefinition): string {
  if (schedule.scheduleKind === "cron") {
    if (!schedule.cron?.trim()) {
      throw new Error("cron schedule requires a cron expression.");
    }

    return schedule.cron.trim();
  }

  return SCHEDULE_CRON_PRESETS[schedule.scheduleKind];
}

export function validateScheduleDefinition(
  schedule: ScheduleDefinition
): ScheduleDefinition {
  if (!schedule.scheduleId.trim()) {
    throw new Error("scheduleId is required.");
  }

  if (!schedule.workflowId.trim()) {
    throw new Error("workflowId is required.");
  }

  if (!SCHEDULE_KINDS.includes(schedule.scheduleKind)) {
    throw new Error(`Unsupported schedule kind: ${schedule.scheduleKind}`);
  }

  resolveScheduleCron(schedule);

  return schedule;
}
