"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { SystemAdminAuditTableRow } from "@/lib/presentation/system-admin-audit-table-row";

export const systemAdminAuditTableColumnDefs: ColumnDef<
  SystemAdminAuditTableRow,
  unknown
>[] = [
  {
    accessorKey: "createdAt",
    header: "When",
    id: "createdAt",
  },
  {
    accessorKey: "action",
    header: "Action",
    id: "action",
  },
  {
    accessorKey: "target",
    header: "Target",
    id: "target",
  },
  {
    accessorKey: "result",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.result}</span>
    ),
    header: "Result",
    id: "result",
  },
  {
    accessorKey: "correlationId",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.correlationId}</span>
    ),
    header: "Correlation",
    id: "correlationId",
  },
];
