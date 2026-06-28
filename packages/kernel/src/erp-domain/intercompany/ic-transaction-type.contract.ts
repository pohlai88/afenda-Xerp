export const IC_TRANSACTION_TYPES = [
  "sale",
  "service",
  "loan",
  "dividend",
] as const;

export type IcTransactionType = (typeof IC_TRANSACTION_TYPES)[number];

export function isIcTransactionType(value: string): value is IcTransactionType {
  return (IC_TRANSACTION_TYPES as readonly string[]).includes(value);
}
