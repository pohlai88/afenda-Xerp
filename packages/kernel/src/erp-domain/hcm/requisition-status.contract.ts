export const REQUISITION_STATUSES = [
  "draft",
  "open",
  "on_hold",
  "filled",
  "cancelled",
] as const;

export type RequisitionStatus = (typeof REQUISITION_STATUSES)[number];

export function isRequisitionStatus(value: string): value is RequisitionStatus {
  return (REQUISITION_STATUSES as readonly string[]).includes(value);
}
