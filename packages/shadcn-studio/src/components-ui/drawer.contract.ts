/** Vendor boundary: vaul — adapter owns styling; do not fork vendor internals. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const DRAWER_PRIMITIVE_ID = "shadcn-studio.ui.drawer" as const;
export type DrawerPrimitiveId = typeof DRAWER_PRIMITIVE_ID;

export const DRAWER_SLOTS = {
  root: "drawer",
  trigger: "drawer-trigger",
  portal: "drawer-portal",
  close: "drawer-close",
  overlay: "drawer-overlay",
  content: "drawer-content",
  header: "drawer-header",
  footer: "drawer-footer",
  title: "drawer-title",
  description: "drawer-description",
  handle: "drawer-handle",
} as const;

export type DrawerSlotMap = typeof DRAWER_SLOTS;
export type DrawerSlot = DrawerSlotMap[keyof DrawerSlotMap];

export const drawerOverlayClassName =
  "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/10 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs" as const;

export const drawerContentClassName =
  "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-popover-foreground text-sm data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm" as const;

export const drawerHandleClassName =
  "mx-auto mt-4 hidden h-1.5 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" as const;

export const drawerHeaderClassName =
  "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left" as const;

export const drawerFooterClassName = "mt-auto flex flex-col gap-2 p-4" as const;

export const drawerTitleClassName =
  "font-heading font-medium text-foreground" as const;

export const drawerDescriptionClassName =
  "text-muted-foreground text-sm" as const;

export function drawerPrimitiveMetadata() {
  return {
    id: DRAWER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: DRAWER_SLOTS,
  } as const;
}
