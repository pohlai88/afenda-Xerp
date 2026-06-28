export const HEDGE_ACCOUNTING_METHODS = [
  "none",
  "cash_flow",
  "fair_value",
] as const;

export type HedgeAccountingMethod = (typeof HEDGE_ACCOUNTING_METHODS)[number];

export function isHedgeAccountingMethod(
  value: string
): value is HedgeAccountingMethod {
  return (HEDGE_ACCOUNTING_METHODS as readonly string[]).includes(value);
}
