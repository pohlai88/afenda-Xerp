"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { procurementRequisitionTableColumnDefs } from "@/lib/presentation/procurement-requisition-table-columns";
import type { ProcurementRequisitionTableRow } from "@/lib/presentation/procurement-requisition-table-row";

export interface ProcurementRequisitionsComposerProps {
  readonly data: readonly ProcurementRequisitionTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function ProcurementRequisitionsComposer({
  data,
  description = "Tenant-scoped requisitions routed through the governed ERP composer.",
  title = "Requisitions",
}: ProcurementRequisitionsComposerProps) {
  return (
    <ErpDataTableComposer
      columns={procurementRequisitionTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "Procurement requisition directory",
        description,
        title,
      }}
    />
  );
}
