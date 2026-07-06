import type { ColumnDef } from "@tanstack/react-table";

import type { SystemAdminPermissionTableRow } from "./system-admin-permission-table-row";

export const systemAdminPermissionTableColumnDefs: ColumnDef<
  SystemAdminPermissionTableRow,
  unknown
>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => row.original.name,
    header: "Permission",
    id: "name",
  },
  {
    accessorKey: "key",
    cell: ({ row }) => row.original.key,
    header: "Key",
    id: "key",
  },
  {
    accessorKey: "domain",
    cell: ({ row }) => row.original.domain,
    header: "Domain",
    id: "domain",
  },
  {
    accessorKey: "action",
    cell: ({ row }) => row.original.action,
    header: "Action",
    id: "action",
  },
];
