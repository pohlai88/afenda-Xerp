export const IC_SETTLEMENT_METHODS = [
  "netting",
  "gross",
  "central_treasury",
] as const;

export type IcSettlementMethod = (typeof IC_SETTLEMENT_METHODS)[number];

export function isIcSettlementMethod(
  value: string
): value is IcSettlementMethod {
  return (IC_SETTLEMENT_METHODS as readonly string[]).includes(value);
}
