"use client";

import * as React from "react";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedTableProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface TableProps
  extends Omit<React.ComponentProps<"table">, "className">,
    GovernedTableProps {
  readonly className?: string;
  readonly state?: string;
}

function Table({
  className,
  state,
  density = "standard",
  size = "sm",
  ...props
}: TableProps) {
  const container = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "body",
    className,
  });

  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    recipeName: "table",
    variant: { density, size },
    state,
    slot: "root",
  });

  return (
    <div {...container.dataAttributes} className={cn(container.className)}>
      <table {...governed.dataAttributes} className={cn(governed.className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "header",
    className,
  });

  return (
    <thead {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "content",
    className,
  });

  return (
    <tbody {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "footer",
    className,
  });

  return (
    <tfoot {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "label",
    className,
  });

  return (
    <tr {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "control",
    className,
  });

  return (
    <th {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "icon",
    className,
  });

  return (
    <td {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Table",
    slot: "state",
    className,
  });

  return (
    <caption {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
