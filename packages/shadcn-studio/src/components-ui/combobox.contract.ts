export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const COMBOBOX_PRIMITIVE_ID = "shadcn-studio.ui.combobox" as const;
export type ComboboxPrimitiveId = typeof COMBOBOX_PRIMITIVE_ID;

export const COMBOBOX_SLOTS = {
  root: "combobox",
  value: "combobox-value",
  trigger: "combobox-trigger",
  clear: "combobox-clear",
  inputGroupButton: "input-group-button",
  portal: "combobox-portal",
  positioner: "combobox-positioner",
  content: "combobox-content",
  list: "combobox-list",
  item: "combobox-item",
  group: "combobox-group",
  label: "combobox-label",
  collection: "combobox-collection",
  empty: "combobox-empty",
  separator: "combobox-separator",
  chips: "combobox-chips",
  chip: "combobox-chip",
  chipRemove: "combobox-chip-remove",
  chipInput: "combobox-chip-input",
  itemIndicator: "combobox-item-indicator",
} as const;

export type ComboboxSlotMap = typeof COMBOBOX_SLOTS;
export type ComboboxSlot = ComboboxSlotMap[keyof ComboboxSlotMap];

export const comboboxTriggerClassName =
  "[&_svg:not([class*='size-'])]:size-4" as const;

export const comboboxTriggerIconClassName =
  "pointer-events-none size-4 text-muted-foreground" as const;

export const comboboxInputGroupClassName = "w-auto" as const;

export const comboboxPositionerClassName = "isolate z-50" as const;

export const comboboxContentClassName =
  "group/combobox-content data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 relative max-h-(--available-height) w-(--anchor-width) min-w-[calc(var(--anchor-width)+--spacing(7))] max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-closed:animate-out data-open:animate-in *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none" as const;

export const comboboxListClassName =
  "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0" as const;

export const comboboxItemClassName =
  "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const comboboxItemIndicatorClassName =
  "pointer-events-none absolute right-2 flex size-4 items-center justify-center" as const;

export const comboboxLabelClassName =
  "px-2 py-1.5 text-muted-foreground text-xs" as const;

export const comboboxEmptyClassName =
  "hidden w-full justify-center py-2 text-center text-muted-foreground text-sm group-data-empty/combobox-content:flex" as const;

export const comboboxSeparatorClassName = "-mx-1 my-1 h-px bg-border" as const;

export const comboboxChipsClassName =
  "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-data-[slot=combobox-chip]:px-1.5 has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40" as const;

export const comboboxChipClassName =
  "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 whitespace-nowrap rounded-sm bg-muted px-1.5 font-medium text-foreground text-xs has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:opacity-50" as const;

export const comboboxChipRemoveClassName =
  "-ml-1 opacity-50 hover:opacity-100" as const;

export const comboboxChipInputClassName =
  "min-w-16 flex-1 outline-none" as const;

export function comboboxPrimitiveMetadata() {
  return {
    id: COMBOBOX_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: COMBOBOX_SLOTS,
  } as const;
}
