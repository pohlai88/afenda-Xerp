import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SIDEBAR_PRIMITIVE_ID = "shadcn-studio.ui.sidebar" as const;
export type SidebarPrimitiveId = typeof SIDEBAR_PRIMITIVE_ID;

export const SIDEBAR_SLOTS = {
  wrapper: "sidebar-wrapper",
  root: "sidebar",
  gap: "sidebar-gap",
  container: "sidebar-container",
  inner: "sidebar-inner",
  trigger: "sidebar-trigger",
  rail: "sidebar-rail",
  inset: "sidebar-inset",
  input: "sidebar-input",
  header: "sidebar-header",
  footer: "sidebar-footer",
  separator: "sidebar-separator",
  content: "sidebar-content",
  group: "sidebar-group",
  groupLabel: "sidebar-group-label",
  groupAction: "sidebar-group-action",
  groupContent: "sidebar-group-content",
  menu: "sidebar-menu",
  menuItem: "sidebar-menu-item",
  menuButton: "sidebar-menu-button",
  menuAction: "sidebar-menu-action",
  menuBadge: "sidebar-menu-badge",
  menuSkeleton: "sidebar-menu-skeleton",
  menuSub: "sidebar-menu-sub",
  menuSubItem: "sidebar-menu-sub-item",
  menuSubButton: "sidebar-menu-sub-button",
} as const;

export type SidebarSlotMap = typeof SIDEBAR_SLOTS;
export type SidebarSlot = SidebarSlotMap[keyof SidebarSlotMap];

export const sidebarProviderWrapperClassName =
  "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar" as const;

export const sidebarStaticRootClassName =
  "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground" as const;

export const sidebarMobileSheetClassName =
  "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden" as const;

export const sidebarMobileInnerClassName =
  "flex h-full w-full flex-col" as const;

export const sidebarPeerClassName =
  "group peer hidden text-sidebar-foreground md:block" as const;

export const sidebarGapBaseClassName =
  "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear" as const;

export const sidebarGapOffcanvasClassName =
  "group-data-[collapsible=offcanvas]:w-0" as const;

export const sidebarGapRightClassName =
  "group-data-[side=right]:rotate-180" as const;

export const sidebarGapIconFloatingClassName =
  "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" as const;

export const sidebarGapIconDefaultClassName =
  "group-data-[collapsible=icon]:w-(--sidebar-width-icon)" as const;

export const sidebarContainerBaseClassName =
  "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=right]:right-0 data-[side=left]:left-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] md:flex" as const;

export const sidebarContainerFloatingClassName =
  "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" as const;

export const sidebarContainerDefaultClassName =
  "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l" as const;

export const sidebarInnerClassName =
  "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border" as const;

export const sidebarRailClassName =
  "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2" as const;

export const sidebarInsetClassName =
  "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm" as const;

export const sidebarInputClassName =
  "h-8 w-full bg-background shadow-none" as const;

export const sidebarHeaderClassName = "flex flex-col gap-2 p-2" as const;

export const sidebarFooterClassName = "flex flex-col gap-2 p-2" as const;

export const sidebarSeparatorClassName =
  "mx-2 w-auto bg-sidebar-border" as const;

export const sidebarContentClassName =
  "no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden" as const;

export const sidebarGroupClassName =
  "relative flex w-full min-w-0 flex-col p-2" as const;

export const sidebarGroupLabelClassName =
  "flex h-8 shrink-0 items-center rounded-md px-2 font-medium text-sidebar-foreground/70 text-xs outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 [&>svg]:size-4 [&>svg]:shrink-0" as const;

export const sidebarGroupActionClassName =
  "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-data-[collapsible=icon]:hidden md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0" as const;

export const sidebarGroupContentClassName = "w-full text-sm" as const;

export const sidebarMenuClassName =
  "flex w-full min-w-0 flex-col gap-1" as const;

export const sidebarMenuItemClassName = "group/menu-item relative" as const;

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type SidebarMenuButtonVariantProps = VariantProps<
  typeof sidebarMenuButtonVariants
>;

export const sidebarMenuActionClassName =
  "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0" as const;

export const sidebarMenuActionShowOnHoverClassName =
  "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground md:opacity-0" as const;

export const sidebarMenuBadgeClassName =
  "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 font-medium text-sidebar-foreground text-xs tabular-nums peer-hover/menu-button:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground" as const;

export const sidebarMenuSkeletonClassName =
  "flex h-8 items-center gap-2 rounded-md px-2" as const;

export const sidebarMenuSkeletonIconClassName = "size-4 rounded-md" as const;

export const sidebarMenuSkeletonTextClassName =
  "h-4 max-w-(--skeleton-width) flex-1" as const;

export const sidebarMenuSubClassName =
  "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-sidebar-border border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden" as const;

export const sidebarMenuSubItemClassName =
  "group/menu-sub-item relative" as const;

export const sidebarMenuSubButtonClassName =
  "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:bg-sidebar-accent data-[size=md]:text-sm data-[size=sm]:text-xs data-active:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground" as const;

export function sidebarPrimitiveMetadata() {
  return {
    id: SIDEBAR_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SIDEBAR_SLOTS,
  } as const;
}
