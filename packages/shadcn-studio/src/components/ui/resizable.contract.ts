export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const RESIZABLE_PRIMITIVE_ID = "shadcn-studio.ui.resizable" as const;
export type ResizablePrimitiveId = typeof RESIZABLE_PRIMITIVE_ID;

export const RESIZABLE_SLOTS = {
  panelGroup: "resizable-panel-group",
  panel: "resizable-panel",
  handle: "resizable-handle",
} as const;

export type ResizableSlotMap = typeof RESIZABLE_SLOTS;
export type ResizableSlot = ResizableSlotMap[keyof ResizableSlotMap];

export const resizablePanelGroupClassName =
  "flex h-full w-full aria-[orientation=vertical]:flex-col" as const;

export const resizableHandleClassName =
  "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90" as const;

export const resizableHandleGripClassName =
  "z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" as const;

export function resizablePrimitiveMetadata() {
  return {
    id: RESIZABLE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: RESIZABLE_SLOTS,
    vendorNotes: "react-resizable-panels",
  } as const;
}
