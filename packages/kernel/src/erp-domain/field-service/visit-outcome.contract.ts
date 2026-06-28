export const VISIT_OUTCOMES = [
  "completed",
  "rescheduled",
  "no_access",
  "parts_required",
] as const;

export type VisitOutcome = (typeof VISIT_OUTCOMES)[number];

export function isVisitOutcome(value: string): value is VisitOutcome {
  return (VISIT_OUTCOMES as readonly string[]).includes(value);
}
