export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const MESSAGE_PRIMITIVE_ID = "shadcn-studio.ui.message" as const;
export type MessagePrimitiveId = typeof MESSAGE_PRIMITIVE_ID;

export const MESSAGE_SLOTS = {
  group: "message-group",
  root: "message",
  avatar: "message-avatar",
  content: "message-content",
  header: "message-header",
  footer: "message-footer",
} as const;

export type MessageSlotMap = typeof MESSAGE_SLOTS;
export type MessageSlot = MessageSlotMap[keyof MessageSlotMap];

export const messageGroupClassName = "flex min-w-0 flex-col gap-2" as const;

export const messageRootClassName =
  "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse" as const;

export const messageAvatarClassName =
  "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8" as const;

export const messageContentClassName =
  "wrap-break-word flex w-full min-w-0 flex-col gap-2.5 group-data-[align=end]/message:*:data-slot:self-end" as const;

export const messageHeaderClassName =
  "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0" as const;

export const messageFooterClassName =
  "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end" as const;

export function messagePrimitiveMetadata() {
  return {
    id: MESSAGE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: MESSAGE_SLOTS,
  } as const;
}
