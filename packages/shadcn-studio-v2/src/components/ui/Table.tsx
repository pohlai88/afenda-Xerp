// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type TableContainerOverflow = "auto" | "visible";

export interface TableContainerProps extends ComponentProps<"div"> {
  readonly overflow?: TableContainerOverflow;
}

const TABLE_CONTAINER_CLASSES = {
  auto: "relative w-full overflow-auto",
  visible: "relative w-full overflow-visible",
} satisfies Record<TableContainerOverflow, string>;

const TABLE_BASE_CLASS = "w-full caption-bottom text-sm";
const TABLE_HEADER_CLASS = "[&_tr]:border-b";
const TABLE_BODY_CLASS = "[&_tr:last-child]:border-0";
const TABLE_FOOTER_CLASS =
  "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0";
const TABLE_ROW_CLASS =
  "border-border border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
const TABLE_HEAD_CLASS =
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0";
const TABLE_CELL_CLASS = "p-4 align-middle [&:has([role=checkbox])]:pr-0";
const TABLE_CAPTION_CLASS = "mt-4 text-muted-foreground text-sm";

export function tableContainerClassName({
  className,
  overflow = "auto",
}: Pick<TableContainerProps, "className" | "overflow"> = {}): string {
  return cn(TABLE_CONTAINER_CLASSES[overflow], className);
}

export function tableClassName({
  className,
}: Pick<ComponentProps<"table">, "className"> = {}): string {
  return cn(TABLE_BASE_CLASS, className);
}

export function tableHeaderClassName({
  className,
}: Pick<ComponentProps<"thead">, "className"> = {}): string {
  return cn(TABLE_HEADER_CLASS, className);
}

export function tableBodyClassName({
  className,
}: Pick<ComponentProps<"tbody">, "className"> = {}): string {
  return cn(TABLE_BODY_CLASS, className);
}

export function tableFooterClassName({
  className,
}: Pick<ComponentProps<"tfoot">, "className"> = {}): string {
  return cn(TABLE_FOOTER_CLASS, className);
}

export function tableRowClassName({
  className,
}: Pick<ComponentProps<"tr">, "className"> = {}): string {
  return cn(TABLE_ROW_CLASS, className);
}

export function tableHeadClassName({
  className,
}: Pick<ComponentProps<"th">, "className"> = {}): string {
  return cn(TABLE_HEAD_CLASS, className);
}

export function tableCellClassName({
  className,
}: Pick<ComponentProps<"td">, "className"> = {}): string {
  return cn(TABLE_CELL_CLASS, className);
}

export function tableCaptionClassName({
  className,
}: Pick<ComponentProps<"caption">, "className"> = {}): string {
  return cn(TABLE_CAPTION_CLASS, className);
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
      className={tableClassName({ className })}
      data-slot="table"
    />
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      {...props}
      className={tableHeaderClassName({ className })}
      data-slot="table-header"
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      {...props}
      className={tableBodyClassName({ className })}
      data-slot="table-body"
    />
  );
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      {...props}
      className={tableFooterClassName({ className })}
      data-slot="table-footer"
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      {...props}
      className={tableRowClassName({ className })}
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
      className={tableHeadClassName({ className })}
      data-slot="table-head"
      scope={scope}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      {...props}
      className={tableCellClassName({ className })}
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
      className={tableCaptionClassName({ className })}
      data-slot="table-caption"
    />
  );
}
