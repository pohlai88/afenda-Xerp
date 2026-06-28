export const TENDER_TYPES = ["cash", "card", "wallet", "voucher"] as const;

export type TenderType = (typeof TENDER_TYPES)[number];

export function isTenderType(value: string): value is TenderType {
  return (TENDER_TYPES as readonly string[]).includes(value);
}
