export const CONSOLIDATION_RUN_STATUSES = [
  "draft",
  "in_progress",
  "posted",
  "locked",
] as const;

export type ConsolidationRunStatus =
  (typeof CONSOLIDATION_RUN_STATUSES)[number];

export function isConsolidationRunStatus(
  value: string
): value is ConsolidationRunStatus {
  return (CONSOLIDATION_RUN_STATUSES as readonly string[]).includes(value);
}
