import type { ProcurementPurchaseOrderTableRow } from "@/lib/presentation/procurement-purchase-order-table-row";

import type { ProcurementPurchaseOrderRow } from "./load-procurement-purchase-orders-page.server";

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

export function mapPurchaseOrderWireToTableRow(
  row: ProcurementPurchaseOrderRow
): ProcurementPurchaseOrderTableRow {
  return {
    deliveryDate: formatDate(row.deliveryDate),
    id: row.id,
    orderDate: formatDate(row.orderDate),
    status: row.status,
    total: formatCurrency(row.total),
    vendor: row.vendor,
  };
}
