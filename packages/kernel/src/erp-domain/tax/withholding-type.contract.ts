export const WITHHOLDING_TYPES = [
  "income",
  "vat",
  "payroll",
  "contractor",
] as const;

export type WithholdingType = (typeof WITHHOLDING_TYPES)[number];

export function isWithholdingType(value: string): value is WithholdingType {
  return (WITHHOLDING_TYPES as readonly string[]).includes(value);
}
