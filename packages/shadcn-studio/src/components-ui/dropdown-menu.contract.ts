export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const DROPDOWN_MENU_PRIMITIVE_ID =
  "shadcn-studio.ui.dropdown-menu" as const;
export type DropdownMenuPrimitiveId = typeof DROPDOWN_MENU_PRIMITIVE_ID;

export const DROPDOWN_MENU_SLOTS = {
  root: "dropdown-menu",
  portal: "dropdown-menu-portal",
  positioner: "dropdown-menu-positioner",
  trigger: "dropdown-menu-trigger",
  content: "dropdown-menu-content",
  group: "dropdown-menu-group",
  label: "dropdown-menu-label",
  item: "dropdown-menu-item",
  sub: "dropdown-menu-sub",
  subTrigger: "dropdown-menu-sub-trigger",
  subContent: "dropdown-menu-sub-content",
  checkboxItem: "dropdown-menu-checkbox-item",
  checkboxItemIndicator: "dropdown-menu-checkbox-item-indicator",
  radioGroup: "dropdown-menu-radio-group",
  radioItem: "dropdown-menu-radio-item",
  radioItemIndicator: "dropdown-menu-radio-item-indicator",
  separator: "dropdown-menu-separator",
  shortcut: "dropdown-menu-shortcut",
} as const;

export type DropdownMenuSlotMap = typeof DROPDOWN_MENU_SLOTS;
export type DropdownMenuSlot = DropdownMenuSlotMap[keyof DropdownMenuSlotMap];

export const dropdownMenuPositionerClassName =
  "isolate z-50 outline-none" as const;

export const dropdownMenuContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in data-closed:overflow-hidden" as const;

export const dropdownMenuSubContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 w-auto min-w-[96px] rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in" as const;

export const dropdownMenuLabelClassName =
  "px-2 py-1.5 font-medium text-muted-foreground text-xs data-inset:pl-8" as const;

export const dropdownMenuItemClassName =
  "group/dropdown-menu-item relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-[variant=destructive]:text-destructive data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-destructive" as const;

export const dropdownMenuSubTriggerClassName =
  "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-open:bg-accent data-popup-open:bg-accent data-inset:pl-8 data-open:text-accent-foreground data-popup-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const dropdownMenuCheckboxItemClassName =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const dropdownMenuCheckboxItemIndicatorClassName =
  "pointer-events-none absolute right-2 flex items-center justify-center" as const;

export const dropdownMenuRadioItemClassName =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-8 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const dropdownMenuRadioItemIndicatorClassName =
  "pointer-events-none absolute right-2 flex items-center justify-center" as const;

export const dropdownMenuSeparatorClassName =
  "-mx-1 my-1 h-px bg-border" as const;

export const dropdownMenuShortcutClassName =
  "ml-auto text-muted-foreground text-xs tracking-widest group-focus/dropdown-menu-item:text-accent-foreground" as const;

export function dropdownMenuPrimitiveMetadata() {
  return {
    id: DROPDOWN_MENU_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: DROPDOWN_MENU_SLOTS,
  } as const;
}
