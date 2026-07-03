"use client";

import type { ComponentProps } from "react";
import { DatatableInvoiceBlock } from "./datatable-invoice";

type InvoiceRow = ComponentProps<typeof DatatableInvoiceBlock>["data"][number];

export interface ProcurementRequisitionsTableRow {
  readonly amount: number;
  readonly department: string;
  readonly id: string;
  readonly neededBy: Date;
  readonly requester: string;
  readonly status: "approved" | "draft" | "rejected" | "submitted";
}

export interface ProcurementRequisitionsTableBlockProps {
  readonly rows: readonly ProcurementRequisitionsTableRow[];
}

function mapRequisitionStatus(
  status: ProcurementRequisitionsTableRow["status"]
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

function mapRequisitionFallback(row: ProcurementRequisitionsTableRow): string {
  const fallbackSource = `${row.requester}${row.department}`.trim();

  if (fallbackSource.length >= 2) {
    return fallbackSource.slice(0, 2).toUpperCase();
  }

  return fallbackSource.toUpperCase().padEnd(2, "R");
}

function mapRequisitionRows(
  rows: readonly ProcurementRequisitionsTableRow[]
): InvoiceRow[] {
  return rows.map((row) => ({
    avatar: "",
    balance: 0,
    client: row.requester,
    fallback: mapRequisitionFallback(row),
    field: `${row.department} · due ${row.neededBy.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    })}`,
    id: row.id,
    issuedDate: row.neededBy,
    status: mapRequisitionStatus(row.status),
    total: row.amount,
  }));
}

export function ProcurementRequisitionsTableBlock({
  rows,
}: ProcurementRequisitionsTableBlockProps) {
  return <DatatableInvoiceBlock data={mapRequisitionRows(rows)} />;
}
