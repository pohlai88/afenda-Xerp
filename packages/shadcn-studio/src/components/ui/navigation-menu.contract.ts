import { cva } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const NAVIGATION_MENU_PRIMITIVE_ID =
  "shadcn-studio.ui.navigation-menu" as const;
export type NavigationMenuPrimitiveId = typeof NAVIGATION_MENU_PRIMITIVE_ID;

export const NAVIGATION_MENU_SLOTS = {
  root: "navigation-menu",
  list: "navigation-menu-list",
  item: "navigation-menu-item",
  trigger: "navigation-menu-trigger",
  content: "navigation-menu-content",
  link: "navigation-menu-link",
  indicator: "navigation-menu-indicator",
  portal: "navigation-menu-portal",
  positioner: "navigation-menu-positioner",
  popup: "navigation-menu-popup",
  viewport: "navigation-menu-viewport",
} as const;

export type NavigationMenuSlotMap = typeof NAVIGATION_MENU_SLOTS;
export type NavigationMenuSlot =
  NavigationMenuSlotMap[keyof NavigationMenuSlotMap];

export const navigationMenuRootClassName =
  "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center" as const;

export const navigationMenuListClassName =
  "group flex flex-1 list-none items-center justify-center gap-0" as const;

export const navigationMenuItemClassName = "relative" as const;

export const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 font-medium text-sm outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-open:bg-muted/50 data-popup-open:bg-muted/50 data-open:focus:bg-muted data-open:hover:bg-muted data-popup-open:hover:bg-muted"
);

export const navigationMenuTriggerIconClassName =
  "relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180" as const;

export const navigationMenuContentClassName =
  "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 h-full w-auto p-2 pr-2.5 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:data-activation-direction=left:translate-x-[50%] data-ending-style:data-activation-direction=right:translate-x-[-50%] data-starting-style:data-activation-direction=left:translate-x-[-50%] data-starting-style:data-activation-direction=right:translate-x-[50%] data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-ending-style:opacity-0 data-starting-style:opacity-0 **:data-[slot=navigation-menu-link]:focus:outline-none **:data-[slot=navigation-menu-link]:focus:ring-0 group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-open:animate-in" as const;

export const navigationMenuPositionerClassName =
  "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0" as const;

export const navigationMenuPopupClassName =
  "data-[ending-style]:easing-[ease] relative h-(--popup-height) w-(--popup-width) xs:w-(--popup-width) origin-(--transform-origin) rounded-lg bg-popover text-popover-foreground shadow outline-none ring-1 ring-foreground/10 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:scale-90 data-starting-style:scale-90 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150" as const;

export const navigationMenuViewportClassName =
  "relative size-full overflow-hidden" as const;

export const navigationMenuLinkClassName =
  "flex items-center gap-1.5 in-data-[slot=navigation-menu-content]:rounded-sm rounded-md p-2 text-sm outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:bg-muted/50 data-[active=true]:focus:bg-muted data-[active=true]:hover:bg-muted [&_svg:not([class*='size-'])]:size-4" as const;

export const navigationMenuIndicatorClassName =
  "data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=visible]:animate-in" as const;

export const navigationMenuIndicatorMarkerClassName =
  "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" as const;

export function navigationMenuPrimitiveMetadata() {
  return {
    id: NAVIGATION_MENU_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: NAVIGATION_MENU_SLOTS,
  } as const;
}
