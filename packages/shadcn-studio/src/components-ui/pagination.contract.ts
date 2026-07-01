export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const PAGINATION_PRIMITIVE_ID = "shadcn-studio.ui.pagination" as const;
export type PaginationPrimitiveId = typeof PAGINATION_PRIMITIVE_ID;

export const PAGINATION_SLOTS = {
  root: "pagination",
  content: "pagination-content",
  item: "pagination-item",
  link: "pagination-link",
  ellipsis: "pagination-ellipsis",
} as const;

export type PaginationSlotMap = typeof PAGINATION_SLOTS;
export type PaginationSlot = PaginationSlotMap[keyof PaginationSlotMap];

export const paginationRootClassName =
  "mx-auto flex w-full justify-center" as const;

export const paginationContentClassName = "flex items-center gap-1" as const;

export const paginationPreviousClassName = "pl-2!" as const;

export const paginationNextClassName = "pr-2!" as const;

export const paginationPreviousTextClassName = "hidden sm:block" as const;

export const paginationNextTextClassName = "hidden sm:block" as const;

export const paginationEllipsisClassName =
  "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4" as const;

export const paginationEllipsisSrOnlyClassName = "sr-only" as const;

export function paginationPrimitiveMetadata() {
  return {
    id: PAGINATION_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: PAGINATION_SLOTS,
  } as const;
}
