/** Gold reference (v1.2.0) — Root → Trigger; Portal → Backdrop → Viewport → Popup; Close via Action/Cancel. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

/** Stable id for metadata binding / diagnostics registries. */
export const ALERT_DIALOG_PRIMITIVE_ID =
  "shadcn-studio.ui.alert-dialog" as const;
export type AlertDialogPrimitiveId = typeof ALERT_DIALOG_PRIMITIVE_ID;

export const ALERT_DIALOG_SLOTS = {
  /** Logical root id for metadata — Root renders no DOM element. */
  root: "alert-dialog",
  trigger: "alert-dialog-trigger",
  portal: "alert-dialog-portal",
  overlay: "alert-dialog-overlay",
  viewport: "alert-dialog-viewport",
  content: "alert-dialog-content",
  header: "alert-dialog-header",
  footer: "alert-dialog-footer",
  media: "alert-dialog-media",
  title: "alert-dialog-title",
  description: "alert-dialog-description",
  action: "alert-dialog-action",
  cancel: "alert-dialog-cancel",
} as const;

export type AlertDialogSlotMap = typeof ALERT_DIALOG_SLOTS;
export type AlertDialogSlot = AlertDialogSlotMap[keyof AlertDialogSlotMap];

export const alertDialogOverlayClassName =
  "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs" as const;

export const alertDialogViewportClassName =
  "fixed inset-0 z-50 flex items-center justify-center p-4" as const;

export const alertDialogContentClassName =
  "group/alert-dialog-content data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 grid w-full gap-6 rounded-xl bg-popover p-6 text-popover-foreground outline-none ring-1 ring-foreground/10 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-closed:animate-out data-open:animate-in data-[size=default]:sm:max-w-lg" as const;

export const alertDialogHeaderClassName =
  "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]" as const;

export const alertDialogFooterClassName =
  "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end" as const;

export const alertDialogMediaClassName =
  "mb-2 inline-flex size-16 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8" as const;

export const alertDialogTitleClassName =
  "font-heading font-medium text-lg sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2" as const;

export const alertDialogDescriptionClassName =
  "text-balance text-muted-foreground text-sm md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground" as const;

export const alertDialogActionClassName = "" as const;
export const alertDialogCancelClassName = "" as const;

/** JSON-serializable metadata payload for binding registries. */
export function alertDialogPrimitiveMetadata() {
  return {
    id: ALERT_DIALOG_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: ALERT_DIALOG_SLOTS,
  } as const;
}
