import type { ColumnDef } from "@tanstack/react-table";

import type { SystemAdminUserTableRow } from "./system-admin-user-table-row";

/**
 * TanStack column defs for system-admin user lists.
 * Column `id` values align with v1 DatatableUserBlock accessors for B-07 parity.
 */
export const systemAdminUserTableColumnDefs: ColumnDef<
  SystemAdminUserTableRow,
  unknown
>[] = [
  {
    accessorKey: "user",
    cell: ({ row }) => row.original.user,
    header: "User",
    id: "user",
  },
  {
    accessorKey: "email",
    cell: ({ row }) => row.original.email,
    header: "Email",
    id: "email",
  },
  {
    accessorKey: "role",
    cell: ({ row }) => row.original.role,
    header: "Role",
    id: "role",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
    header: "Status",
    id: "status",
  },
];
