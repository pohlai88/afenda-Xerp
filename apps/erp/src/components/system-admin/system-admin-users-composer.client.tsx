"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { systemAdminUserTableColumnDefs } from "@/lib/presentation/system-admin-user-table-columns";
import type { SystemAdminUserTableRow } from "@/lib/presentation/system-admin-user-table-row";

export interface SystemAdminUsersComposerProps {
  readonly data: readonly SystemAdminUserTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function SystemAdminUsersComposer({
  data,
  description = "Directory of tenant users and membership status.",
  title = "Users",
}: SystemAdminUsersComposerProps) {
  return (
    <ErpDataTableComposer
      columns={systemAdminUserTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "System admin user directory",
        description,
        title,
      }}
    />
  );
}
