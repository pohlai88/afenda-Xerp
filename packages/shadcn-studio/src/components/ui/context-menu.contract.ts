export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CONTEXT_MENU_PRIMITIVE_ID =
  "shadcn-studio.ui.context-menu" as const;
export type ContextMenuPrimitiveId = typeof CONTEXT_MENU_PRIMITIVE_ID;

export const CONTEXT_MENU_SLOTS = {
  root: "context-menu",
  portal: "context-menu-portal",
  positioner: "context-menu-positioner",
  trigger: "context-menu-trigger",
  content: "context-menu-content",
  group: "context-menu-group",
  label: "context-menu-label",
  item: "context-menu-item",
  sub: "context-menu-sub",
  subTrigger: "context-menu-sub-trigger",
  subContent: "context-menu-sub-content",
  checkboxItem: "context-menu-checkbox-item",
  checkboxItemIndicator: "context-menu-checkbox-item-indicator",
  radioGroup: "context-menu-radio-group",
  radioItem: "context-menu-radio-item",
  radioItemIndicator: "context-menu-radio-item-indicator",
  separator: "context-menu-separator",
  shortcut: "context-menu-shortcut",
} as const;

export type ContextMenuSlotMap = typeof CONTEXT_MENU_SLOTS;
export type ContextMenuSlot = ContextMenuSlotMap[keyof ContextMenuSlotMap];

export const contextMenuTriggerClassName = "select-none" as const;

export const contextMenuPositionerClassName =
  "isolate z-50 outline-none" as const;

export const contextMenuContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in" as const;

export const contextMenuSubContentClassName = "shadow-lg" as const;

export const contextMenuLabelClassName =
  "px-2 py-1.5 font-medium text-muted-foreground text-xs data-inset:pl-8" as const;

export const contextMenuItemClassName =
  "group/context-menu-item relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-[variant=destructive]:text-destructive data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive" as const;

export const contextMenuSubTriggerClassName =
  "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-inset:pl-8 data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const contextMenuCheckboxItemClassName =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const contextMenuCheckboxItemIndicatorClassName =
  "pointer-events-none absolute right-2" as const;

export const contextMenuRadioItemClassName =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const contextMenuRadioItemIndicatorClassName =
  "pointer-events-none absolute right-2" as const;

export const contextMenuSeparatorClassName =
  "-mx-1 my-1 h-px bg-border" as const;

export const contextMenuShortcutClassName =
  "ml-auto text-muted-foreground text-xs tracking-widest group-focus/context-menu-item:text-accent-foreground" as const;

export function contextMenuPrimitiveMetadata() {
  return {
    id: CONTEXT_MENU_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CONTEXT_MENU_SLOTS,
  } as const;
}
