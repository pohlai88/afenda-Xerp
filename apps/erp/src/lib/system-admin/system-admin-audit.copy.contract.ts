export interface SystemAdminAuditEmptyStateCopy {
  readonly description: string;
  readonly title: string;
}

export interface SystemAdminAuditTableCopy {
  readonly columnAction: string;
  readonly columnCorrelationId: string;
  readonly columnModule: string;
  readonly columnResult: string;
  readonly columnTarget: string;
  readonly columnTime: string;
  readonly emptyStateDescription: string;
  readonly emptyStateTitle: string;
  readonly tableCaption: string;
}

export const SYSTEM_ADMIN_AUDIT_TABLE_COPY = {
  columnAction: "Action",
  columnCorrelationId: "Correlation ID",
  columnModule: "Module",
  columnResult: "Result",
  columnTarget: "Target",
  columnTime: "Time",
  emptyStateDescription:
    "No audit events have been recorded for this tenant yet. Events appear here once users perform audited actions.",
  emptyStateTitle: "No audit events",
  tableCaption: "Recent System Admin audit events — tenant-scoped, read-only",
} as const satisfies SystemAdminAuditTableCopy;
