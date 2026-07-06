import type { ColumnDef } from "@tanstack/react-table";

import type { SystemAdminRoleTableRow } from "./system-admin-role-table-row";

export const systemAdminRoleTableColumnDefs: ColumnDef<
  SystemAdminRoleTableRow,
  unknown
>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => row.original.name,
    header: "Role",
    id: "name",
  },
  {
    accessorKey: "key",
    cell: ({ row }) => row.original.key,
    header: "Key",
    id: "key",
  },
  {
    accessorKey: "scope",
    cell: ({ row }) => row.original.scope,
    header: "Scope",
    id: "scope",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
    header: "Status",
    id: "status",
  },
];
