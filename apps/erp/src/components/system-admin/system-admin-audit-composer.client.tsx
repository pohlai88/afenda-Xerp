"use client";

import { ErpDataTableComposer } from "@/components/presentation/erp-datatable-composer.client";
import { systemAdminAuditTableColumnDefs } from "@/lib/presentation/system-admin-audit-table-columns";
import type { SystemAdminAuditTableRow } from "@/lib/presentation/system-admin-audit-table-row";

export interface SystemAdminAuditComposerProps {
  readonly data: readonly SystemAdminAuditTableRow[];
  readonly description?: string;
  readonly title?: string;
}

export function SystemAdminAuditComposer({
  data,
  description = "Recent audit events for the active tenant scope.",
  title = "Audit events",
}: SystemAdminAuditComposerProps) {
  return (
    <ErpDataTableComposer
      columns={systemAdminAuditTableColumnDefs}
      data={data}
      getRowId={(row) => row.id}
      surface={{
        caption: "System administration audit trail",
        description,
        state: data.length === 0 ? "empty" : "ready",
        stateMessages: {
          empty: {
            description: "No audit events recorded for this tenant scope yet.",
            title: "No audit events",
          },
        },
        title,
      }}
    />
  );
}
