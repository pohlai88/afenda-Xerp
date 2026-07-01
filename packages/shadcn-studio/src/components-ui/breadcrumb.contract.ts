export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BREADCRUMB_PRIMITIVE_ID = "shadcn-studio.ui.breadcrumb" as const;
export type BreadcrumbPrimitiveId = typeof BREADCRUMB_PRIMITIVE_ID;

export const BREADCRUMB_SLOTS = {
  root: "breadcrumb",
  list: "breadcrumb-list",
  item: "breadcrumb-item",
  link: "breadcrumb-link",
  page: "breadcrumb-page",
  separator: "breadcrumb-separator",
  ellipsis: "breadcrumb-ellipsis",
} as const;

export type BreadcrumbSlotMap = typeof BREADCRUMB_SLOTS;
export type BreadcrumbSlot = BreadcrumbSlotMap[keyof BreadcrumbSlotMap];

export const breadcrumbRootClassName = "" as const;

export const breadcrumbListClassName =
  "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm sm:gap-2.5" as const;

export const breadcrumbItemClassName =
  "inline-flex items-center gap-1.5" as const;

export const breadcrumbLinkClassName =
  "transition-colors hover:text-foreground" as const;

export const breadcrumbPageClassName = "font-normal text-foreground" as const;

export const breadcrumbSeparatorClassName = "[&>svg]:size-3.5" as const;

export const breadcrumbEllipsisClassName =
  "flex size-5 items-center justify-center [&>svg]:size-4" as const;

export function breadcrumbPrimitiveMetadata() {
  return {
    id: BREADCRUMB_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BREADCRUMB_SLOTS,
  } as const;
}
