"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { procurementPurchaseOrderTableColumnDefs } from "@/lib/presentation/procurement-purchase-order-table-columns";
import type { ProcurementPurchaseOrderTableRow } from "@/lib/presentation/procurement-purchase-order-table-row";

export interface ProcurementPurchaseOrdersComposerProps {
  readonly data: readonly ProcurementPurchaseOrderTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function ProcurementPurchaseOrdersComposer({
  data,
  description = "Tenant-scoped purchase orders routed through the governed ERP composer.",
  title = "Purchase orders",
}: ProcurementPurchaseOrdersComposerProps) {
  return (
    <ErpDataTableComposer
      columns={procurementPurchaseOrderTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "Procurement purchase order directory",
        description,
        title,
      }}
    />
  );
}
