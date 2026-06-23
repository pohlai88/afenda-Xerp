import type { GovernedTableProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import * as React from "react";

const TABLE_RECIPE_NAME = "table" as const;

type TableSlotKey = "container" | "row" | "head" | "cell" | "caption";

/**
 * Maps Table subcomponent names to governed slot targets.
 * Semantic table vocabulary is mapped to registry SlotRole or slotKey entries.
 */
const TABLE_SLOT_TARGETS = {
  container: { slotKey: "container" },
  root: { slot: "root" },
  header: { slot: "header" },
  body: { slot: "content" },
  footer: { slot: "footer" },
  row: { slotKey: "row" },
  head: { slotKey: "head" },
  cell: { slotKey: "cell" },
  caption: { slotKey: "caption" },
} as const satisfies Record<
  | "container"
  | "root"
  | "header"
  | "body"
  | "footer"
  | "row"
  | "head"
  | "cell"
  | "caption",
  { readonly slot?: SlotRole; readonly slotKey?: TableSlotKey }
>;

type TableSlotName = keyof typeof TABLE_SLOT_TARGETS;

interface GovernedClassNameProps {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

export interface TableProps
  extends Omit<React.TableHTMLAttributes<HTMLTableElement>, "className">,
    GovernedTableProps,
    GovernedClassNameProps {
  /**
   * Governed extension point for the table scroll/container wrapper.
   */
  readonly containerClassName?: string;
}

function resolveTableGovernance(input: {
  readonly target: TableSlotName;
  readonly className?: string | undefined;
  readonly variant?: GovernedTableProps;
  readonly state?: GovernedTableProps["state"];
}) {
  const target = TABLE_SLOT_TARGETS[input.target];

  return resolvePrimitiveGovernance({
    componentName: "Table",
    recipeName: TABLE_RECIPE_NAME,
    ...(input.variant === undefined ? {} : { variant: input.variant }),
    ...(input.state === undefined ? {} : { state: input.state }),
    ...("slotKey" in target && target.slotKey !== undefined
      ? { slotKey: target.slotKey }
      : { slot: target.slot }),
    ...(input.className === undefined ? {} : { className: input.className }),
  });
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      state,
      density = "standard",
      size = "sm",
      ...props
    },
    ref
  ) => {
    const container = resolveTableGovernance({
      target: "container",
      className: containerClassName,
    });

    const governed = resolveTableGovernance({
      target: "root",
      className,
      variant: { density, size },
      state,
    });

    return (
      <div {...applyGovernedPresentation({}, container)}>
        <table
          ref={ref}
          {...props}
          data-density={density}
          data-size={size}
          {...governed.dataAttributes}
          className={cn(governed.className)}
        />
      </div>
    );
  }
);

Table.displayName = "Table";

type TableSectionProps = Omit<
  React.HTMLAttributes<HTMLTableSectionElement>,
  "className"
> &
  GovernedClassNameProps;

export type TableRowProps = Omit<
  React.HTMLAttributes<HTMLTableRowElement>,
  "className"
> &
  GovernedClassNameProps;

export type TableHeadProps = Omit<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  "className"
> &
  GovernedClassNameProps;

export type TableCellProps = Omit<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  "className"
> &
  GovernedClassNameProps;

export type TableCaptionProps = Omit<
  React.HTMLAttributes<HTMLTableCaptionElement>,
  "className"
> &
  GovernedClassNameProps;

function createTableSectionSlot(
  displayName: string,
  target: "header" | "body" | "footer",
  Element: "thead" | "tbody" | "tfoot"
) {
  const TableSection = React.forwardRef<
    HTMLTableSectionElement,
    TableSectionProps
  >(({ className, ...props }, ref) => {
    const governed = resolveTableGovernance({
      target,
      className,
    });

    return (
      <Element
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  });

  TableSection.displayName = displayName;

  return TableSection;
}

const TableHeader = createTableSectionSlot("TableHeader", "header", "thead");
const TableBody = createTableSectionSlot("TableBody", "body", "tbody");
const TableFooter = createTableSectionSlot("TableFooter", "footer", "tfoot");

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    const governed = resolveTableGovernance({
      target: "row",
      className,
    });

    return (
      <tr
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    const governed = resolveTableGovernance({
      target: "head",
      className,
    });

    return (
      <th
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    const governed = resolveTableGovernance({
      target: "cell",
      className,
    });

    return (
      <td
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => {
  const governed = resolveTableGovernance({
    target: "caption",
    className,
  });

  return (
    <caption
      ref={ref}
      {...props}
      {...governed.dataAttributes}
      className={cn(governed.className)}
    />
  );
});

TableCaption.displayName = "TableCaption";

export type { TableSectionProps };
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
