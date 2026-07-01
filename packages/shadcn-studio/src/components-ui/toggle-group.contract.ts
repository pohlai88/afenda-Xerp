export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const TOGGLE_GROUP_PRIMITIVE_ID =
  "shadcn-studio.ui.toggle-group" as const;
export type ToggleGroupPrimitiveId = typeof TOGGLE_GROUP_PRIMITIVE_ID;

export const TOGGLE_GROUP_SLOTS = {
  root: "toggle-group",
  item: "toggle-group-item",
} as const;

export type ToggleGroupSlotMap = typeof TOGGLE_GROUP_SLOTS;
export type ToggleGroupSlot = ToggleGroupSlotMap[keyof ToggleGroupSlotMap];

export const toggleGroupRootClassName =
  "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=0]:data-[variant=outline]:shadow-xs data-vertical:flex-col data-vertical:items-stretch" as const;

export const toggleGroupItemSpacingClassName =
  "shrink-0 focus:z-10 focus-visible:z-10 data-[state=on]:bg-muted group-data-[spacing=0]/toggle-group:rounded-none group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:shadow-none group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md" as const;

export function toggleGroupPrimitiveMetadata() {
  return {
    id: TOGGLE_GROUP_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: TOGGLE_GROUP_SLOTS,
  } as const;
}
