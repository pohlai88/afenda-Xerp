import { Badge } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { ColumnDef } from "@tanstack/react-table";

import type { AdminAuditEventRow } from "@/lib/system-admin/list-recent-audit-events.server";
import { SYSTEM_ADMIN_AUDIT_TABLE_COPY } from "@/lib/system-admin/system-admin-audit.copy.contract";

export type SystemAdminAuditColumnsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge"
>;

function resolveAuditResultTone(
  result: AdminAuditEventRow["result"]
): AuditResultTone["tone"] {
  switch (result) {
    case "success":
    case "approved":
      return "success";
    case "failure":
      return "critical";
    case "blocked":
    case "rejected":
    case "reversed":
      return "danger";
    case "denied":
      return "forbidden";
    case "pending":
      return "pending";
    default:
      return "pending";
  }
}
function SortIndicator({
  isSorted,
}: {
  readonly isSorted: false | "asc" | "desc";
}) {
  if (isSorted === "asc") {
    return (
      <svg
        aria-hidden="true"
        className="erp-system-admin-audit-table__sort-icon"
        fill="none"
        height="14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <title>{"sorted ascending"}</title>
        <path d="m18 15-6-6-6 6" />
      </svg>
    );
  }
  if (isSorted === "desc") {
    return (
      <svg
        aria-hidden="true"
        className="erp-system-admin-audit-table__sort-icon"
        fill="none"
        height="14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <title>{"sorted descending"}</title>
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="erp-system-admin-audit-table__sort-icon erp-system-admin-audit-table__sort-icon--unsorted"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="14"
    >
      <title>{"unsorted"}</title>
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function SortHeader({
  canSort,
  isSorted,
  label,
  onToggle,
}: {
  readonly canSort: boolean;
  readonly isSorted: false | "asc" | "desc";
  readonly label: string;
  readonly onToggle: ((event: unknown) => void) | undefined;
}) {
  if (!canSort) {
    return <span>{label}</span>;
  }

  const sortStateLabel =
    isSorted === "asc"
      ? ", sorted ascending"
      : isSorted === "desc"
        ? ", sorted descending"
        : "";

  return (
    <button
      aria-label={`Sort by ${label}${sortStateLabel}`}
      className="erp-system-admin-audit-table__sort-trigger"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle?.(e);
        }
      }}
      tabIndex={0}
      type="button"
    >
      {label}
      <SortIndicator isSorted={isSorted} />
    </button>
  );
}

export function createSystemAdminAuditColumns(): ColumnDef<AdminAuditEventRow>[] {
  return [
    {
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const iso = getValue<string>();
        return (
          <time className="erp-system-admin-audit-table__time" dateTime={iso}>
            {new Date(iso).toLocaleString()}
          </time>
        );
      },
      enableSorting: true,
      header: ({ column }) => (
        <SortHeader
          canSort={column.getCanSort()}
          isSorted={column.getIsSorted()}
          label={SYSTEM_ADMIN_AUDIT_TABLE_COPY.columnTime}
          onToggle={column.getToggleSortingHandler()}
        />
      ),
      id: "createdAt",
    },
    {
      accessorKey: "module",
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      enableSorting: true,
      header: ({ column }) => (
        <SortHeader
          canSort={column.getCanSort()}
          isSorted={column.getIsSorted()}
          label={SYSTEM_ADMIN_AUDIT_TABLE_COPY.columnModule}
          onToggle={column.getToggleSortingHandler()}
        />
      ),
      id: "module",
    },
    {
      accessorKey: "action",
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      enableSorting: false,
      header: SYSTEM_ADMIN_AUDIT_TABLE_COPY.columnAction,
      id: "action",
    },
    {
      accessorFn: (row) =>
        row.targetId === null
          ? row.targetType
          : `${row.targetType} / ${row.targetId}`,
      cell: ({ getValue }) => (
        <span className="erp-system-admin-audit-table__target">
          {getValue<string>()}
        </span>
      ),
      enableSorting: false,
      header: SYSTEM_ADMIN_AUDIT_TABLE_COPY.columnTarget,
      id: "target",
    },
    {
      accessorKey: "result",
      cell: ({ getValue }) => {
        const result = getValue<AdminAuditEventRow["result"]>();
        const tone = resolveAuditResultTone(result);
        return (
          <div className="erp-audit-result-badge">
            <Badge emphasis="soft" tone={tone}>
              {result}
            </Badge>
          </div>
        );
      },
      enableSorting: true,
      header: ({ column }) => (
        <SortHeader
          canSort={column.getCanSort()}
          isSorted={column.getIsSorted()}
          label={SYSTEM_ADMIN_AUDIT_TABLE_COPY.columnResult}
          onToggle={column.getToggleSortingHandler()}
        />
      ),
      id: "result",
    },
    {
      accessorKey: "correlationId",
      cell: ({ getValue }) => (
        <code className="erp-system-admin-audit-table__correlation-id">
          {getValue<string>()}
        </code>
      ),
      enableSorting: false,
      header: SYSTEM_ADMIN_AUDIT_TABLE_COPY.columnCorrelationId,
      id: "correlationId",
    },
  ];
}
