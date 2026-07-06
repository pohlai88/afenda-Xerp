export type ProcurementRequisitionTableStatus =
  | "approved"
  | "draft"
  | "rejected"
  | "submitted";

export interface ProcurementRequisitionTableRow {
  readonly amount: string;
  readonly department: string;
  readonly id: string;
  readonly neededBy: string;
  readonly requester: string;
  readonly status: ProcurementRequisitionTableStatus;
}
