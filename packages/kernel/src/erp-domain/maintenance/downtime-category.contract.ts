export const DOWNTIME_CATEGORIES = [
  "planned",
  "unplanned",
  "setup",
  "breakdown",
] as const;

export type DowntimeCategory = (typeof DOWNTIME_CATEGORIES)[number];

export function isDowntimeCategory(value: string): value is DowntimeCategory {
  return (DOWNTIME_CATEGORIES as readonly string[]).includes(value);
}
