export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const MESSAGE_SCROLLER_PRIMITIVE_ID =
  "shadcn-studio.ui.message-scroller" as const;
export type MessageScrollerPrimitiveId = typeof MESSAGE_SCROLLER_PRIMITIVE_ID;

export const MESSAGE_SCROLLER_VENDOR =
  "@shadcn/react/message-scroller" as const;

export const MESSAGE_SCROLLER_SLOTS = {
  root: "message-scroller",
  viewport: "message-scroller-viewport",
  content: "message-scroller-content",
  item: "message-scroller-item",
  button: "message-scroller-button",
} as const;

export type MessageScrollerSlotMap = typeof MESSAGE_SCROLLER_SLOTS;
export type MessageScrollerSlot =
  MessageScrollerSlotMap[keyof MessageScrollerSlotMap];

export const messageScrollerRootClassName =
  "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden" as const;

export const messageScrollerViewportClassName =
  "scroll-fade-b scrollbar-thin scrollbar-gutter-stable data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content" as const;

export const messageScrollerContentClassName =
  "flex h-max min-h-full flex-col gap-8" as const;

export const messageScrollerItemClassName =
  "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]" as const;

export const messageScrollerButtonClassName =
  "absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:data-[active=false]:-translate-y-full data-[active=false]:pointer-events-none data-[direction=start]:top-4 data-[direction=end]:bottom-4 data-[active=true]:translate-y-0 data-[active=false]:scale-95 data-[active=true]:scale-100 data-[active=false]:opacity-0 data-[active=true]:opacity-100 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180" as const;

export function messageScrollerPrimitiveMetadata() {
  return {
    id: MESSAGE_SCROLLER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: MESSAGE_SCROLLER_SLOTS,
    vendor: MESSAGE_SCROLLER_VENDOR,
  } as const;
}
