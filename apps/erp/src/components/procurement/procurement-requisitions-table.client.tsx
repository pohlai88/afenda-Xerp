"use client";

import { DatatableInvoiceBlock } from "@afenda/shadcn-studio";
import type { ComponentProps } from "react";
import type { ProcurementRequisitionRow } from "@/lib/procurement/load-procurement-requisitions-page.server";

type InvoiceRow = ComponentProps<typeof DatatableInvoiceBlock>["data"][number];

export interface ProcurementRequisitionsTableProps {
  readonly rows: readonly ProcurementRequisitionRow[];
}

function mapRequisitionStatus(
  status: ProcurementRequisitionRow["status"]
): InvoiceRow["status"] {
  if (status === "approved") {
    return "paid";
  }
  if (status === "rejected") {
    return "past due";
  }
  if (status === "submitted") {
    return "downloaded";
  }
  return "draft";
}

function mapRequisitionFallback(row: ProcurementRequisitionRow): string {
  const safeText = `${row.requester}${row.department}`.trim();

  if (safeText.length >= 2) {
    return safeText.slice(0, 2).toUpperCase();
  }

  return safeText.toUpperCase().padEnd(2, "R");
}

function mapRequisitionRows(
  rows: readonly ProcurementRequisitionRow[]
): InvoiceRow[] {
  return rows.map((row) => ({
    avatar: "",
    balance: 0,
    client: row.requester,
    fallback: mapRequisitionFallback(row),
    field: `${row.department} · due ${row.neededBy.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })}`,
    id: row.id,
    issuedDate: row.neededBy,
    status: mapRequisitionStatus(row.status),
    total: row.amount,
  }));
}

export function ProcurementRequisitionsTable({
  rows,
}: ProcurementRequisitionsTableProps) {
  const mappedRows = mapRequisitionRows(rows);

  return <DatatableInvoiceBlock data={mappedRows} />;
}
