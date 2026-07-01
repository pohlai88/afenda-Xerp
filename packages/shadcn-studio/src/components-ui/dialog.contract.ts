/** Gold overlay primitive — Portal → Backdrop → Viewport → Popup. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const DIALOG_PRIMITIVE_ID = "shadcn-studio.ui.dialog" as const;
export type DialogPrimitiveId = typeof DIALOG_PRIMITIVE_ID;

export const DIALOG_SLOTS = {
  root: "dialog",
  trigger: "dialog-trigger",
  portal: "dialog-portal",
  close: "dialog-close",
  overlay: "dialog-overlay",
  viewport: "dialog-viewport",
  content: "dialog-content",
  header: "dialog-header",
  footer: "dialog-footer",
  title: "dialog-title",
  description: "dialog-description",
} as const;

export type DialogSlotMap = typeof DIALOG_SLOTS;
export type DialogSlot = DialogSlotMap[keyof DialogSlotMap];

export const dialogOverlayClassName =
  "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs" as const;

export const dialogViewportClassName =
  "fixed inset-0 z-50 flex items-center justify-center p-4" as const;

export const dialogContentClassName =
  "group/dialog-content data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 relative grid w-full max-w-[calc(100%-2rem)] gap-6 rounded-xl bg-popover p-6 text-popover-foreground text-sm outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in sm:max-w-md" as const;

export const dialogHeaderClassName = "flex flex-col gap-2" as const;

export const dialogFooterClassName =
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end" as const;

export const dialogTitleClassName =
  "font-heading font-medium leading-none" as const;

export const dialogDescriptionClassName =
  "text-muted-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground" as const;

export const dialogCloseButtonClassName = "absolute top-4 right-4" as const;

export function dialogPrimitiveMetadata() {
  return {
    id: DIALOG_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: DIALOG_SLOTS,
  } as const;
}
