export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SELECT_PRIMITIVE_ID = "shadcn-studio.ui.select" as const;
export type SelectPrimitiveId = typeof SELECT_PRIMITIVE_ID;

export const SELECT_SLOTS = {
  root: "select",
  group: "select-group",
  value: "select-value",
  trigger: "select-trigger",
  portal: "select-portal",
  positioner: "select-positioner",
  content: "select-content",
  list: "select-list",
  label: "select-label",
  item: "select-item",
  itemIndicator: "select-item-indicator",
  separator: "select-separator",
  scrollUpButton: "select-scroll-up-button",
  scrollDownButton: "select-scroll-down-button",
} as const;

export type SelectSlotMap = typeof SELECT_SLOTS;
export type SelectSlot = SelectSlotMap[keyof SelectSlotMap];

export const selectGroupClassName = "scroll-my-1 p-1" as const;

export const selectValueClassName = "flex flex-1 text-left" as const;

export const selectTriggerClassName =
  "flex w-fit items-center justify-between gap-1.5 whitespace-nowrap rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-placeholder:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const selectTriggerIconClassName =
  "pointer-events-none size-4 text-muted-foreground" as const;

export const selectPositionerClassName = "isolate z-50" as const;

export const selectContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-closed:animate-out data-open:animate-in" as const;

export const selectLabelClassName =
  "px-2 py-1.5 text-muted-foreground text-xs" as const;

export const selectItemClassName =
  "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2" as const;

export const selectItemIndicatorClassName =
  "pointer-events-none absolute right-2 flex size-4 items-center justify-center" as const;

export const selectSeparatorClassName =
  "pointer-events-none -mx-1 my-1 h-px bg-border" as const;

export const selectScrollButtonClassName =
  "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4" as const;

export const selectScrollDownButtonClassName =
  "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4" as const;

export function selectPrimitiveMetadata() {
  return {
    id: SELECT_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SELECT_SLOTS,
  } as const;
}
