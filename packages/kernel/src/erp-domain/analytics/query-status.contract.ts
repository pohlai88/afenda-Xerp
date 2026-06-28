export const QUERY_STATUSES = [
  "draft",
  "validated",
  "scheduled",
  "failed",
] as const;

export type QueryStatus = (typeof QUERY_STATUSES)[number];

export function isQueryStatus(value: string): value is QueryStatus {
  return (QUERY_STATUSES as readonly string[]).includes(value);
}
