"use client";

import {
  DatatableUserBlock,
  type DatatableUserRow,
} from "@afenda/shadcn-studio";

export interface SystemAdminUsersTableProps {
  readonly data: readonly DatatableUserRow[];
}

export function SystemAdminUsersTable({ data }: SystemAdminUsersTableProps) {
  return <DatatableUserBlock data={[...data]} />;
}
