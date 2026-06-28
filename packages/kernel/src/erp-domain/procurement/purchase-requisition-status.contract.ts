export const PURCHASE_REQUISITION_STATUSES = [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "cancelled",
] as const;

export type PurchaseRequisitionStatus =
  (typeof PURCHASE_REQUISITION_STATUSES)[number];

export function isPurchaseRequisitionStatus(
  value: string
): value is PurchaseRequisitionStatus {
  return (PURCHASE_REQUISITION_STATUSES as readonly string[]).includes(value);
}
