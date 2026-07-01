/** Gold overlay primitive — Portal → Backdrop → Viewport → Popup (edge sheet). */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SHEET_PRIMITIVE_ID = "shadcn-studio.ui.sheet" as const;
export type SheetPrimitiveId = typeof SHEET_PRIMITIVE_ID;

export const SHEET_SLOTS = {
  root: "sheet",
  trigger: "sheet-trigger",
  close: "sheet-close",
  portal: "sheet-portal",
  overlay: "sheet-overlay",
  viewport: "sheet-viewport",
  content: "sheet-content",
  header: "sheet-header",
  footer: "sheet-footer",
  title: "sheet-title",
  description: "sheet-description",
} as const;

export type SheetSlotMap = typeof SHEET_SLOTS;
export type SheetSlot = SheetSlotMap[keyof SheetSlotMap];

export const sheetOverlayClassName =
  "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs" as const;

export const sheetViewportClassName = "fixed inset-0 z-50" as const;

export const sheetContentClassName =
  "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-popover-foreground text-sm shadow-lg transition duration-200 ease-in-out data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=bottom]:inset-x-0 data-[side=top]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:h-auto data-[side=left]:h-full data-[side=right]:h-full data-[side=top]:h-auto data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=bottom]:border-t data-[side=left]:border-r data-[side=top]:border-b data-[side=right]:border-l data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm" as const;

export const sheetHeaderClassName = "flex flex-col gap-1.5 p-4" as const;

export const sheetFooterClassName = "mt-auto flex flex-col gap-2 p-4" as const;

export const sheetTitleClassName =
  "font-heading font-medium text-foreground" as const;

export const sheetDescriptionClassName =
  "text-muted-foreground text-sm" as const;

export const sheetCloseButtonClassName = "absolute top-4 right-4" as const;

export function sheetPrimitiveMetadata() {
  return {
    id: SHEET_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SHEET_SLOTS,
  } as const;
}
