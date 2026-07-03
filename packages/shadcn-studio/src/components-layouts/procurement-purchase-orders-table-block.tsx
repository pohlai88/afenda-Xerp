"use client";

import type { ComponentProps } from "react";
import { DatatableInvoiceBlock } from "./datatable-invoice";

type InvoiceRow = ComponentProps<typeof DatatableInvoiceBlock>["data"][number];

export interface ProcurementPurchaseOrdersTableRow {
  readonly deliveryDate: Date;
  readonly id: string;
  readonly orderDate: Date;
  readonly status: "cancelled" | "open" | "partial" | "received";
  readonly total: number;
  readonly vendor: string;
}

export interface ProcurementPurchaseOrdersTableBlockProps {
  readonly rows: readonly ProcurementPurchaseOrdersTableRow[];
}

function mapPurchaseOrderStatus(
  status: ProcurementPurchaseOrdersTableRow["status"]
): InvoiceRow["status"] {
  if (status === "received") {
    return "paid";
  }

  if (status === "cancelled") {
    return "downloaded";
  }

  if (status === "partial") {
    return "past due";
  }

  return "draft";
}

function mapPurchaseOrderRows(
  rows: readonly ProcurementPurchaseOrdersTableRow[]
): InvoiceRow[] {
  return rows.map((row) => ({
    avatar: "",
    balance: 0,
    client: row.vendor,
    fallback: row.vendor.slice(0, 2).toUpperCase(),
    field: `${row.deliveryDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    })} · delivery`,
    id: row.id,
    issuedDate: row.orderDate,
    status: mapPurchaseOrderStatus(row.status),
    total: row.total,
  }));
}

export function ProcurementPurchaseOrdersTableBlock({
  rows,
}: ProcurementPurchaseOrdersTableBlockProps) {
  return <DatatableInvoiceBlock data={mapPurchaseOrderRows(rows)} />;
}
