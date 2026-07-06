import type { ColumnDef } from "@tanstack/react-table";

import type { ProcurementReadinessTableRow } from "./procurement-readiness-table-row";

export const procurementReadinessTableColumnDefs: ColumnDef<
  ProcurementReadinessTableRow,
  unknown
>[] = [
  {
    accessorKey: "label",
    header: "Checklist item",
    id: "label",
  },
  {
    accessorKey: "sliceId",
    header: "Slice",
    id: "sliceId",
    meta: { align: "right" as const },
  },
  {
    accessorKey: "status",
    header: "Status",
    id: "status",
    meta: { align: "right" as const },
  },
];
