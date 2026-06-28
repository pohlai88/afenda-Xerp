export const REVIEW_CYCLE_STATUSES = [
  "planned",
  "in_progress",
  "calibration",
  "closed",
] as const;

export type ReviewCycleStatus = (typeof REVIEW_CYCLE_STATUSES)[number];

export function isReviewCycleStatus(value: string): value is ReviewCycleStatus {
  return (REVIEW_CYCLE_STATUSES as readonly string[]).includes(value);
}
