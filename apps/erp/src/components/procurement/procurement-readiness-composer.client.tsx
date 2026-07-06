"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { procurementReadinessTableColumnDefs } from "@/lib/presentation/procurement-readiness-table-columns";
import type { ProcurementReadinessTableRow } from "@/lib/presentation/procurement-readiness-table-row";

export interface ProcurementReadinessComposerProps {
  readonly data: readonly ProcurementReadinessTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function ProcurementReadinessComposer({
  data,
  description = "Foundation readiness checklist routed through v2 DataTableSurface.",
  title = "Procurement readiness",
}: ProcurementReadinessComposerProps) {
  return (
    <ErpDataTableComposer
      columns={procurementReadinessTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "Procurement foundation readiness checklist",
        description,
        title,
      }}
    />
  );
}
