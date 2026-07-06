"use client";

import {
  DataTableSurface,
  type DataTableSurfaceColumn,
  type DataTableSurfaceProps,
  type DataTableSurfaceRow,
} from "@afenda/shadcn-studio-v2/clients";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { type ReactNode, useMemo } from "react";

export type ErpDataTableSurfaceProps = Omit<
  DataTableSurfaceProps,
  "columns" | "rows"
>;

export interface ErpDataTableComposerProps<TData> {
  readonly columns: ColumnDef<TData, unknown>[];
  readonly data: readonly TData[];
  readonly getRowId: (row: TData) => string;
  readonly surface: ErpDataTableSurfaceProps;
}

function readColumnAlign(
  meta: ColumnDef<unknown, unknown>["meta"]
): DataTableSurfaceColumn["align"] | undefined {
  if (meta == null || typeof meta !== "object" || !("align" in meta)) {
    return undefined;
  }

  const { align } = meta as { align?: DataTableSurfaceColumn["align"] };
  return align;
}

export function ErpDataTableComposer<TData>({
  columns,
  data,
  getRowId,
  surface,
}: ErpDataTableComposerProps<TData>) {
  const tableData = useMemo(() => [...data], [data]);

  const table = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => getRowId(row),
  });

  const projectedColumns: readonly DataTableSurfaceColumn[] = table
    .getFlatHeaders()
    .map((header) => {
      const align = readColumnAlign(header.column.columnDef.meta);
      const column: DataTableSurfaceColumn = {
        header: flexRender(
          header.column.columnDef.header,
          header.getContext()
        ),
        id: header.column.id,
      };

      return align == null ? column : { ...column, align };
    });

  const projectedRows: readonly DataTableSurfaceRow[] = table
    .getRowModel()
    .rows.map((row) => {
      const cells: Record<string, ReactNode> = {};

      for (const cell of row.getVisibleCells()) {
        cells[cell.column.id] = flexRender(
          cell.column.columnDef.cell,
          cell.getContext()
        );
      }

      return {
        cells,
        id: row.id,
      };
    });

  return (
    <DataTableSurface
      {...surface}
      columns={projectedColumns}
      rows={projectedRows}
      state={surface.state ?? (projectedRows.length === 0 ? "empty" : "ready")}
    />
  );
}
