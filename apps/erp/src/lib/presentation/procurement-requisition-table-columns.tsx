import type { ColumnDef } from "@tanstack/react-table";

import type { ProcurementRequisitionTableRow } from "./procurement-requisition-table-row";

export const procurementRequisitionTableColumnDefs: ColumnDef<
  ProcurementRequisitionTableRow,
  unknown
>[] = [
  {
    accessorKey: "id",
    cell: ({ row }) => row.original.id,
    header: "Req #",
    id: "id",
  },
  {
    accessorKey: "requester",
    cell: ({ row }) => row.original.requester,
    header: "Requester",
    id: "requester",
  },
  {
    accessorKey: "department",
    cell: ({ row }) => row.original.department,
    header: "Department",
    id: "department",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
    header: "Status",
    id: "status",
  },
  {
    accessorKey: "amount",
    cell: ({ row }) => row.original.amount,
    header: "Amount",
    id: "amount",
  },
  {
    accessorKey: "neededBy",
    cell: ({ row }) => row.original.neededBy,
    header: "Needed by",
    id: "neededBy",
  },
];
