"use client";

import { DatatableInvoiceBlock } from "@afenda/shadcn-studio";
import type { ComponentProps } from "react";
import type { ProcurementPurchaseOrderRow } from "@/lib/procurement/load-procurement-purchase-orders-page.server";

type InvoiceRow = ComponentProps<typeof DatatableInvoiceBlock>["data"][number];

export interface ProcurementPurchaseOrdersTableProps {
  readonly rows: readonly ProcurementPurchaseOrderRow[];
}

function mapPurchaseOrderStatus(
  status: ProcurementPurchaseOrderRow["status"]
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

function mapPurchaseOrderFallback(row: ProcurementPurchaseOrderRow): string {
  return row.vendor.slice(0, 2).toUpperCase();
}

function mapPurchaseOrderRows(
  rows: readonly ProcurementPurchaseOrderRow[]
): InvoiceRow[] {
  return rows.map((row) => ({
    avatar: "",
    balance: 0,
    client: row.vendor,
    fallback: mapPurchaseOrderFallback(row),
    field: `${row.deliveryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })} · delivery`,
    id: row.id,
    issuedDate: row.orderDate,
    status: mapPurchaseOrderStatus(row.status),
    total: row.total,
  }));
}

export function ProcurementPurchaseOrdersTable({
  rows,
}: ProcurementPurchaseOrdersTableProps) {
  const mappedRows = mapPurchaseOrderRows(rows);

  return <DatatableInvoiceBlock data={mappedRows} />;
}
