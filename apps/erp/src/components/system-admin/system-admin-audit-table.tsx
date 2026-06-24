"use client";

import { DataTable } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import type { ErpEmptyStateProps } from "@/lib/erp/erp-empty-state.contract";
import type { AdminAuditEventRow } from "@/lib/system-admin/list-recent-audit-events.server";
import { SYSTEM_ADMIN_AUDIT_TABLE_COPY } from "@/lib/system-admin/system-admin-audit.copy.contract";
import { ErpEmptyState } from "../erp-empty-state";
import { createSystemAdminAuditColumns } from "./system-admin-audit-table.columns";

export type SystemAdminAuditTableSurfaceGovernedComponents = Extract<
  GovernedUiComponentName,
  "DataTable"
>;

const PAGE_SIZE = 20;

const AUDIT_EMPTY_STATE_PROPS = {
  description: SYSTEM_ADMIN_AUDIT_TABLE_COPY.emptyStateDescription,
  iconKey: "settings",
  surfaceVariant: "system-admin-audit",
  title: SYSTEM_ADMIN_AUDIT_TABLE_COPY.emptyStateTitle,
  variant: "static",
} as const satisfies ErpEmptyStateProps;

export interface SystemAdminAuditTableProps {
  readonly rows: readonly AdminAuditEventRow[];
}

export function SystemAdminAuditTable({ rows }: SystemAdminAuditTableProps) {
  const columns = useMemo(() => createSystemAdminAuditColumns(), []);

  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: "createdAt" },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const tableData = useMemo(() => [...rows], [rows]);

  const table = useReactTable({
    columns,
    data: tableData,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { pagination, sorting },
  });

  if (rows.length === 0) {
    return <ErpEmptyState {...AUDIT_EMPTY_STATE_PROPS} />;
  }

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageStart = pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalRows
  );

  return (
    <div className="erp-system-admin-audit-table">
      <section
        aria-label={SYSTEM_ADMIN_AUDIT_TABLE_COPY.tableCaption}
        className="erp-system-admin-audit-table__scroll"
      >
        <DataTable
          emptyMessage={SYSTEM_ADMIN_AUDIT_TABLE_COPY.emptyStateTitle}
          table={table}
        />
      </section>
      <div className="erp-system-admin-audit-table__footer">
        <p aria-live="polite" className="erp-system-admin-audit-table__summary">
          {totalRows === 0
            ? "No entries to display"
            : `Showing ${pageStart}–${pageEnd} of ${totalRows}`}
        </p>
        <div className="erp-system-admin-audit-table__pagination">
          <button
            className="erp-system-admin-audit-table__page-btn"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            type="button"
          >
            Previous
          </button>
          <span className="erp-system-admin-audit-table__page-indicator">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            className="erp-system-admin-audit-table__page-btn"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
