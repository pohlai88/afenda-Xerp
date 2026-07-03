"use client";

import { DatatableUserBlock, type DatatableUserRow } from "./datatable-user";

export interface SystemAdminUsersTableBlockProps {
  readonly data: readonly DatatableUserRow[];
}

export function SystemAdminUsersTableBlock({
  data,
}: SystemAdminUsersTableBlockProps) {
  return <DatatableUserBlock data={[...data]} />;
}
