import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";

export type ProcurementPurchaseOrderRow = {
  id: string;
  status: "open" | "partial" | "received" | "cancelled";
  vendor: string;
  total: number;
  orderDate: Date;
  deliveryDate: Date;
};

export type ProcurementPurchaseOrdersPageData =
  | {
      readonly kind: "error";
      readonly message: string;
      readonly title: string;
    }
  | {
      readonly blockId: "datatable-procurement-purchase-orders";
      readonly correlationId: string;
      readonly kind: "ready";
      readonly routePattern: string;
      readonly rows: readonly ProcurementPurchaseOrderRow[];
      readonly spineDelegate: "loadProtectedRequestOperatingContext";
      readonly tenantId: string;
      readonly title: string;
    };

const FIXTURE_ROWS: ProcurementPurchaseOrderRow[] = [
  {
    id: "PO-8801",
    status: "open",
    vendor: "Northwind Supplies",
    total: 12_400,
    orderDate: new Date("2026-06-12"),
    deliveryDate: new Date("2026-07-05"),
  },
  {
    id: "PO-8802",
    status: "partial",
    vendor: "Acme Industrial",
    total: 8600,
    orderDate: new Date("2026-06-18"),
    deliveryDate: new Date("2026-07-12"),
  },
  {
    id: "PO-8803",
    status: "received",
    vendor: "Globex Parts",
    total: 3200,
    orderDate: new Date("2026-05-30"),
    deliveryDate: new Date("2026-06-20"),
  },
];

/** ERP-PROC-OP-007 — purchase orders list route consumes PAS-001A IS-002 spine + fixture rows. */
export async function loadProcurementPurchaseOrdersPage(): Promise<ProcurementPurchaseOrdersPageData> {
  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    return {
      kind: "error",
      title: "Purchase orders",
      message: operatingResult.error.userMessage,
    };
  }

  return {
    kind: "ready",
    title: "Purchase orders",
    routePattern: "/modules/procurement/purchase-orders",
    spineDelegate: "loadProtectedRequestOperatingContext",
    tenantId: operatingResult.value.tenant.tenantId,
    correlationId: operatingResult.value.correlationId,
    blockId: "datatable-procurement-purchase-orders",
    rows: FIXTURE_ROWS,
  };
}
