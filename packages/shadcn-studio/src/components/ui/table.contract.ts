export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const TABLE_PRIMITIVE_ID = "shadcn-studio.ui.table" as const;
export type TablePrimitiveId = typeof TABLE_PRIMITIVE_ID;

export const TABLE_SLOTS = {
  container: "table-container",
  root: "table",
  header: "table-header",
  body: "table-body",
  footer: "table-footer",
  row: "table-row",
  head: "table-head",
  cell: "table-cell",
  caption: "table-caption",
} as const;

export type TableSlotMap = typeof TABLE_SLOTS;
export type TableSlot = TableSlotMap[keyof TableSlotMap];

export const tableContainerClassName =
  "relative w-full overflow-x-auto" as const;

export const tableRootClassName = "w-full caption-bottom text-sm" as const;

export const tableHeaderClassName = "[&_tr]:border-b" as const;

export const tableBodyClassName = "[&_tr:last-child]:border-0" as const;

export const tableFooterClassName =
  "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0" as const;

export const tableRowClassName =
  "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted" as const;

export const tableHeadClassName =
  "h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0" as const;

export const tableCellClassName =
  "whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0" as const;

export const tableCaptionClassName =
  "mt-4 text-muted-foreground text-sm" as const;

export function tablePrimitiveMetadata() {
  return {
    id: TABLE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: TABLE_SLOTS,
  } as const;
}
