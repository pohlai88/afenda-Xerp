"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { systemAdminPermissionTableColumnDefs } from "@/lib/presentation/system-admin-permission-table-columns";
import type { SystemAdminPermissionTableRow } from "@/lib/presentation/system-admin-permission-table-row";

export interface SystemAdminPermissionsComposerProps {
  readonly data: readonly SystemAdminPermissionTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function SystemAdminPermissionsComposer({
  data,
  description = "Global permission catalog for governed ERP capabilities.",
  title = "Permissions",
}: SystemAdminPermissionsComposerProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No permissions are registered in the catalog yet.
      </p>
    );
  }

  return (
    <ErpDataTableComposer
      columns={systemAdminPermissionTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "System admin permission catalog",
        description,
        title,
      }}
    />
  );
}
