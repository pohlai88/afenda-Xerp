"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { systemAdminRoleTableColumnDefs } from "@/lib/presentation/system-admin-role-table-columns";
import type { SystemAdminRoleTableRow } from "@/lib/presentation/system-admin-role-table-row";

export interface SystemAdminRolesComposerProps {
  readonly data: readonly SystemAdminRoleTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function SystemAdminRolesComposer({
  data,
  description = "Tenant role templates for the active legal entity.",
  title = "Roles",
}: SystemAdminRolesComposerProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No roles are configured for this tenant yet.
      </p>
    );
  }

  return (
    <ErpDataTableComposer
      columns={systemAdminRoleTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "System admin role directory",
        description,
        title,
      }}
    />
  );
}
