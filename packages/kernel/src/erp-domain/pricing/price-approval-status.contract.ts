export const PRICE_APPROVAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export type PriceApprovalStatus = (typeof PRICE_APPROVAL_STATUSES)[number];

export function isPriceApprovalStatus(
  value: string
): value is PriceApprovalStatus {
  return (PRICE_APPROVAL_STATUSES as readonly string[]).includes(value);
}
