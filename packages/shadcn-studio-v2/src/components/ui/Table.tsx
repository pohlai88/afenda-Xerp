// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface TableContainerProps extends ComponentProps<"div"> {
  readonly overflow?: "auto" | "visible";
}

const TABLE_CONTAINER_CLASSES = {
  auto: "relative w-full overflow-auto",
  visible: "relative w-full overflow-visible",
} satisfies Record<NonNullable<TableContainerProps["overflow"]>, string>;

export function tableContainerClassName({
  className,
  overflow = "auto",
}: Pick<TableContainerProps, "className" | "overflow"> = {}): string {
  return cn(TABLE_CONTAINER_CLASSES[overflow], className);
}

export function TableContainer({
  className,
  overflow = "auto",
  ...props
}: TableContainerProps) {
  return (
    <div
      {...props}
      className={tableContainerClassName({ className, overflow })}
      data-slot="table-container"
    />
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      {...props}
      className={cn("w-full caption-bottom text-sm", className)}
      data-slot="table"
    />
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      {...props}
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      {...props}
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
    />
  );
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      {...props}
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      data-slot="table-footer"
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      {...props}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      data-slot="table-row"
    />
  );
}

export function TableHead({
  className,
  scope = "col",
  ...props
}: ComponentProps<"th">) {
  return (
    <th
      {...props}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-head"
      scope={scope}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      {...props}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-cell"
    />
  );
}

export function TableCaption({
  className,
  ...props
}: ComponentProps<"caption">) {
  return (
    <caption
      {...props}
      className={cn("mt-4 text-muted-foreground text-sm", className)}
      data-slot="table-caption"
    />
  );
}
