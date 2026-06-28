export const IC_MATCHING_STATUSES = [
  "open",
  "matched",
  "disputed",
  "settled",
] as const;

export type IcMatchingStatus = (typeof IC_MATCHING_STATUSES)[number];

export function isIcMatchingStatus(value: string): value is IcMatchingStatus {
  return (IC_MATCHING_STATUSES as readonly string[]).includes(value);
}
