export type ProcurementPurchaseOrderTableStatus =
  | "cancelled"
  | "open"
  | "partial"
  | "received";

export interface ProcurementPurchaseOrderTableRow {
  readonly deliveryDate: string;
  readonly id: string;
  readonly orderDate: string;
  readonly status: ProcurementPurchaseOrderTableStatus;
  readonly total: string;
  readonly vendor: string;
}
