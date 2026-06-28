export const EARNINGS_TYPES = [
  "regular",
  "overtime",
  "bonus",
  "allowance",
] as const;

export type EarningsType = (typeof EARNINGS_TYPES)[number];

export function isEarningsType(value: string): value is EarningsType {
  return (EARNINGS_TYPES as readonly string[]).includes(value);
}
