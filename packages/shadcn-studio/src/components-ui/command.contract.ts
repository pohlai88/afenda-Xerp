/** Vendor boundary: cmdk — adapter owns styling; do not fork vendor internals. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const COMMAND_PRIMITIVE_ID = "shadcn-studio.ui.command" as const;
export type CommandPrimitiveId = typeof COMMAND_PRIMITIVE_ID;

export const COMMAND_SLOTS = {
  root: "command",
  inputWrapper: "command-input-wrapper",
  input: "command-input",
  list: "command-list",
  empty: "command-empty",
  group: "command-group",
  separator: "command-separator",
  item: "command-item",
  shortcut: "command-shortcut",
} as const;

export type CommandSlotMap = typeof COMMAND_SLOTS;
export type CommandSlot = CommandSlotMap[keyof CommandSlotMap];

export const commandRootClassName =
  "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground" as const;

export const commandDialogHeaderClassName = "sr-only" as const;

export const commandDialogContentClassName =
  "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0" as const;

export const commandInputWrapperClassName = "p-1 pb-0" as const;

export const commandInputGroupClassName =
  "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!" as const;

export const commandInputClassName =
  "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50" as const;

export const commandListClassName =
  "no-scrollbar max-h-72 scroll-py-1 overflow-y-auto overflow-x-hidden outline-none" as const;

export const commandEmptyClassName = "py-6 text-center text-sm" as const;

export const commandGroupClassName =
  "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group-heading]]:text-xs" as const;

export const commandSeparatorClassName = "-mx-1 h-px w-auto bg-border" as const;

export const commandItemClassName =
  "group/command-item relative flex cursor-default select-none items-center gap-2 in-data-[slot=dialog-content]:rounded-lg! rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-selected:bg-muted data-selected:text-foreground data-[disabled=true]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-selected:**:[svg]:text-foreground" as const;

export const commandItemCheckClassName =
  "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" as const;

export const commandShortcutClassName =
  "ml-auto text-muted-foreground text-xs tracking-widest group-data-selected/command-item:text-foreground" as const;

export const commandSearchIconClassName = "size-4 shrink-0 opacity-50" as const;

export function commandPrimitiveMetadata() {
  return {
    id: COMMAND_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: COMMAND_SLOTS,
  } as const;
}
