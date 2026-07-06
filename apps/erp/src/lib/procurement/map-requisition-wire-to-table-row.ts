import type { ProcurementRequisitionTableRow } from "@/lib/presentation/procurement-requisition-table-row";

import type { ProcurementRequisitionRow } from "./load-procurement-requisitions-page.server";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

function formatDate(value: Date): string {
  return value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function mapRequisitionWireToTableRow(
  row: ProcurementRequisitionRow
): ProcurementRequisitionTableRow {
  return {
    amount: formatCurrency(row.amount),
    department: row.department,
    id: row.id,
    neededBy: formatDate(row.neededBy),
    requester: row.requester,
    status: row.status,
  };
}
