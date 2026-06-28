export const DEDUCTION_TYPES = [
  "tax",
  "benefit",
  "garnishment",
  "voluntary",
] as const;

export type DeductionType = (typeof DEDUCTION_TYPES)[number];

export function isDeductionType(value: string): value is DeductionType {
  return (DEDUCTION_TYPES as readonly string[]).includes(value);
}
