"use client";

import type { GovernedDataTableProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const DATA_TABLE_RECIPE_NAME = "table" as const;

const DATA_TABLE_SLOT_ROLES = {
  root: "root",
  icon: "icon",
} as const satisfies Record<string, SlotRole>;

export interface DataTableProps<TData>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedDataTableProps {
  readonly className?: string;
  readonly emptyMessage?: string;
  readonly table: TanstackTable<TData>;
}

function DataTableInner<TData>(
  {
    table,
    className,
    density,
    emptyMessage = "No results.",
    size,
    state,
    ...props
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const rootGoverned = resolvePrimitiveGovernance({
    componentName: "DataTable",
    recipeName: DATA_TABLE_RECIPE_NAME,
    state,
    slot: DATA_TABLE_SLOT_ROLES.root,
    className,
  });

  const emptyCellGoverned = resolvePrimitiveGovernance({
    componentName: "DataTable",
    recipeName: DATA_TABLE_RECIPE_NAME,
    slot: DATA_TABLE_SLOT_ROLES.icon,
  });

  return (
    <div ref={ref} {...applyGovernedPresentation(props, rootGoverned)}>
      <Table
        {...(density === undefined ? {} : { density })}
        {...(size === undefined ? {} : { size })}
        {...(state === undefined ? {} : { state })}
      >
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
              <TableCell colSpan={table.getAllColumns().length}>
                <div
                  role="status"
                  {...applyGovernedPresentation({}, emptyCellGoverned)}
                >
                  {emptyMessage}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const DataTable = React.forwardRef(DataTableInner) as <TData>(
  props: DataTableProps<TData> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;

Object.assign(DataTable, { displayName: "DataTable" });

export { DataTable };
