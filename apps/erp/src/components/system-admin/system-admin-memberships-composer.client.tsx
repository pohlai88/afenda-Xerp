"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { systemAdminMembershipTableColumnDefs } from "@/lib/presentation/system-admin-membership-table-columns";
import type { SystemAdminMembershipTableRow } from "@/lib/presentation/system-admin-membership-table-row";

export interface SystemAdminMembershipsComposerProps {
  readonly data: readonly SystemAdminMembershipTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function SystemAdminMembershipsComposer({
  data,
  description = "Company-scoped memberships with role assignments for the active legal entity.",
  title = "Memberships",
}: SystemAdminMembershipsComposerProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No active memberships exist for this company scope yet.
      </p>
    );
  }

  return (
    <ErpDataTableComposer
      columns={systemAdminMembershipTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "System admin membership directory",
        description,
        title,
      }}
    />
  );
}
