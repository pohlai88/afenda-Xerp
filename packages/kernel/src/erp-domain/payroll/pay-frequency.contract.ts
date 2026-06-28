export const PAY_FREQUENCIES = [
  "weekly",
  "biweekly",
  "semimonthly",
  "monthly",
] as const;

export type PayFrequency = (typeof PAY_FREQUENCIES)[number];

export function isPayFrequency(value: string): value is PayFrequency {
  return (PAY_FREQUENCIES as readonly string[]).includes(value);
}
