export const TIMESHEET_STATUSES = [
  "draft",
  "submitted",
  "approved",
  "rejected",
] as const;

export type TimesheetStatus = (typeof TIMESHEET_STATUSES)[number];

export function isTimesheetStatus(value: string): value is TimesheetStatus {
  return (TIMESHEET_STATUSES as readonly string[]).includes(value);
}
