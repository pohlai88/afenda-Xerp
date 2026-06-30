export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const MENUBAR_PRIMITIVE_ID = "shadcn-studio.ui.menubar" as const;
export type MenubarPrimitiveId = typeof MENUBAR_PRIMITIVE_ID;

export const MENUBAR_SLOTS = {
  root: "menubar",
  menu: "menubar-menu",
  group: "menubar-group",
  portal: "menubar-portal",
  trigger: "menubar-trigger",
  content: "menubar-content",
  item: "menubar-item",
  checkboxItem: "menubar-checkbox-item",
  checkboxItemIndicator: "menubar-checkbox-item-indicator",
  radioGroup: "menubar-radio-group",
  radioItem: "menubar-radio-item",
  radioItemIndicator: "menubar-radio-item-indicator",
  label: "menubar-label",
  separator: "menubar-separator",
  shortcut: "menubar-shortcut",
  sub: "menubar-sub",
  subTrigger: "menubar-sub-trigger",
  subContent: "menubar-sub-content",
} as const;

export type MenubarSlotMap = typeof MENUBAR_SLOTS;
export type MenubarSlot = MenubarSlotMap[keyof MenubarSlotMap];

export const menubarRootClassName =
  "flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs" as const;

export const menubarTriggerClassName =
  "flex select-none items-center rounded-sm px-2 py-1 font-medium text-sm outline-hidden hover:bg-muted aria-expanded:bg-muted" as const;

export const menubarContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 min-w-36 rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in" as const;

export const menubarItemClassName =
  "group/menubar-item gap-2 rounded-sm px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!" as const;

export const menubarCheckboxItemClassName =
  "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const menubarCheckboxItemIndicatorClassName =
  "pointer-events-none absolute left-2 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4" as const;

export const menubarRadioItemClassName =
  "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const menubarRadioItemIndicatorClassName =
  "pointer-events-none absolute left-2 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4" as const;

export const menubarLabelClassName =
  "px-2 py-1.5 font-medium text-sm data-inset:pl-8" as const;

export const menubarSeparatorClassName = "-mx-1 my-1 h-px bg-border" as const;

export const menubarShortcutClassName =
  "ml-auto text-muted-foreground text-xs tracking-widest group-focus/menubar-item:text-accent-foreground" as const;

export const menubarSubTriggerClassName =
  "gap-2 rounded-sm px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-inset:pl-8 data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4" as const;

export const menubarSubContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 min-w-32 rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in" as const;

export function menubarPrimitiveMetadata() {
  return {
    id: MENUBAR_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: MENUBAR_SLOTS,
  } as const;
}
