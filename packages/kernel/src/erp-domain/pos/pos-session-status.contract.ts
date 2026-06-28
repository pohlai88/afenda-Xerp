export const POS_SESSION_STATUSES = [
  "open",
  "suspended",
  "closed",
  "reconciled",
] as const;

export type PosSessionStatus = (typeof POS_SESSION_STATUSES)[number];

export function isPosSessionStatus(value: string): value is PosSessionStatus {
  return (POS_SESSION_STATUSES as readonly string[]).includes(value);
}
