export const INSPECTION_RESULT_STATUSES = [
  "pending",
  "pass",
  "fail",
  "conditional",
] as const;

export type InspectionResultStatus =
  (typeof INSPECTION_RESULT_STATUSES)[number];

export function isInspectionResultStatus(
  value: string
): value is InspectionResultStatus {
  return (INSPECTION_RESULT_STATUSES as readonly string[]).includes(value);
}
