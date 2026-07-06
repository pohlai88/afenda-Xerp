import type { ColumnDef } from "@tanstack/react-table";

import type { SystemAdminMembershipTableRow } from "./system-admin-membership-table-row";

export const systemAdminMembershipTableColumnDefs: ColumnDef<
  SystemAdminMembershipTableRow,
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
