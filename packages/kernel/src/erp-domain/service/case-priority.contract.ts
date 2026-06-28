export const CASE_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export type CasePriority = (typeof CASE_PRIORITIES)[number];

export function isCasePriority(value: string): value is CasePriority {
  return (CASE_PRIORITIES as readonly string[]).includes(value);
}
