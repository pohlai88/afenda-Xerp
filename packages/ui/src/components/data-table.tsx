"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const DATA_TABLE_RECIPE_NAME = "table" as const;

interface DataTableProps<TData> {
  className?: string;
  emptyMessage?: string;
  table: TanstackTable<TData>;
}

function DataTable<TData>({
  table,
  className,
  emptyMessage = "No results.",
}: DataTableProps<TData>) {
  const rootGoverned = resolvePrimitiveGovernance({
    componentName: "DataTable",
    recipeName: DATA_TABLE_RECIPE_NAME,
    slot: "root",
    className,
  });

  const emptyCellGoverned = resolvePrimitiveGovernance({
    componentName: "DataTable",
    recipeName: DATA_TABLE_RECIPE_NAME,
    slot: "icon",
  });

  return (
    <div {...applyGovernedPresentation({}, rootGoverned)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                data-state={row.getIsSelected() ? "selected" : undefined}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                {...applyGovernedPresentation({}, emptyCellGoverned)}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export type { DataTableProps };
export { DataTable };
