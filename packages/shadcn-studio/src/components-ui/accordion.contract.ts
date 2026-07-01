export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

/** Stable id for metadata binding / diagnostics registries. */
export const ACCORDION_PRIMITIVE_ID = "shadcn-studio.ui.accordion" as const;
export type AccordionPrimitiveId = typeof ACCORDION_PRIMITIVE_ID;

export const ACCORDION_SLOTS = {
  root: "accordion",
  item: "accordion-item",
  header: "accordion-header",
  trigger: "accordion-trigger",
  triggerIcon: "accordion-trigger-icon",
  content: "accordion-content",
  contentInner: "accordion-content-inner",
} as const;

export type AccordionSlotMap = typeof ACCORDION_SLOTS;
export type AccordionSlot = AccordionSlotMap[keyof AccordionSlotMap];

export const accordionRootClassName = "flex w-full flex-col" as const;
export const accordionItemClassName = "not-last:border-b" as const;
export const accordionHeaderClassName = "flex" as const;
export const accordionTriggerClassName =
  "group/accordion-trigger relative flex flex-1 items-start justify-between gap-3 rounded-md border border-transparent py-4 text-left text-sm font-medium outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50" as const;
export const accordionTriggerIconClassName =
  "pointer-events-none ml-auto size-4 shrink-0 text-muted-foreground" as const;
/** Panel — collapse height driven by Base UI `--accordion-panel-height` + data attributes. */
export const accordionContentPanelClassName =
  "h-[var(--accordion-panel-height)] overflow-hidden text-sm transition-[height] duration-200 ease-out data-[starting-style]:h-0 data-[ending-style]:h-0" as const;
export const accordionContentInnerClassName =
  "pt-0 pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4" as const;

/** JSON-serializable metadata payload for binding registries. */
export function accordionPrimitiveMetadata() {
  return {
    id: ACCORDION_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: ACCORDION_SLOTS,
  } as const;
}
