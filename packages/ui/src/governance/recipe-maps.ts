import type {
  GovernedPanelRadius,
  GovernedPanelShadow,
} from "./component-props";
import type {
  Density,
  GovernedSize,
  SlotRole,
  StatusTone,
  VariantEmphasis,
  VariantIntent,
} from "./design-system";

type SlotClassMap<TKey extends string> = Readonly<Record<TKey, string>>;

export type CardSlotRoleKey = Extract<
  SlotRole,
  "header" | "content" | "footer" | "actions" | "label" | "body"
>;

export type AlertSlotRoleKey = Extract<SlotRole, "label" | "body" | "actions">;

export type FieldSlotRoleKey = Extract<
  SlotRole,
  | "header"
  | "body"
  | "label"
  | "content"
  | "control"
  | "state"
  | "footer"
  | "actions"
>;

export type FieldSlotKey =
  | "title"
  | "separatorLine"
  | "separatorContent"
  | "errorList";

export type TableSlotRoleKey = Extract<
  SlotRole,
  "header" | "content" | "footer"
>;

export type TableSlotKey = "container" | "row" | "head" | "cell" | "caption";

export const buttonIntentEmphasis: Record<
  VariantIntent,
  Record<VariantEmphasis, string>
> = {
  primary: {
    solid:
      "bg-primary text-primary-foreground hover:bg-primary/80 aria-expanded:bg-primary/80",
    soft: "bg-primary/10 text-primary hover:bg-primary/15",
    outline:
      "border-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
    ghost:
      "text-primary hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted/50",
  },
  secondary: {
    solid:
      "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
    soft: "bg-secondary/60 text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border-border bg-background text-secondary-foreground hover:bg-secondary/30",
    ghost:
      "text-secondary-foreground hover:bg-secondary/40 aria-expanded:bg-secondary/40",
  },
  quiet: {
    solid: "bg-muted text-foreground hover:bg-muted/80",
    soft: "bg-muted/60 text-foreground hover:bg-muted/80",
    outline:
      "border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground",
    ghost:
      "text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted/50",
  },
  destructive: {
    solid:
      "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
    soft: "bg-destructive/5 text-destructive hover:bg-destructive/10",
    outline:
      "border-destructive/40 bg-background text-destructive hover:bg-destructive/10",
    ghost: "text-destructive hover:bg-destructive/10",
  },
};

export const buttonIconSizeClasses: Record<GovernedSize, string> = {
  xs: "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
  sm: "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
  md: "size-8",
  lg: "size-9",
};

export const toneEmphasisClasses: Record<
  StatusTone,
  Record<VariantEmphasis, string>
> = {
  neutral: {
    solid: "bg-muted text-foreground",
    soft: "bg-muted/60 text-foreground",
    outline: "border-border text-foreground",
    ghost: "text-muted-foreground",
  },
  info: {
    solid: "bg-primary/10 text-primary",
    soft: "bg-primary/5 text-primary",
    outline: "border-primary/20 text-primary",
    ghost: "text-primary",
  },
  success: {
    solid: "bg-accent text-accent-foreground",
    soft: "bg-accent/60 text-accent-foreground",
    outline: "border-accent-foreground/20 text-accent-foreground",
    ghost: "text-accent-foreground",
  },
  warning: {
    solid: "bg-chart-3/10 text-foreground",
    soft: "bg-chart-3/5 text-foreground",
    outline: "border-chart-3/30 text-foreground",
    ghost: "text-foreground",
  },
  danger: {
    solid:
      "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
    soft: "bg-destructive/5 text-destructive",
    outline: "border-destructive/40 text-destructive",
    ghost: "text-destructive",
  },
  forbidden: {
    solid: "bg-destructive/5 text-destructive",
    soft: "bg-destructive/5 text-destructive",
    outline: "border-destructive/40 text-destructive",
    ghost: "text-destructive",
  },
  invalid: {
    solid: "bg-destructive/10 text-destructive",
    soft: "bg-destructive/5 text-destructive",
    outline: "border-destructive/50 text-destructive",
    ghost: "text-destructive",
  },
};

export const badgeToneEmphasis: Record<
  StatusTone,
  Record<VariantEmphasis, string>
> = {
  neutral: {
    solid: "bg-muted text-foreground [a]:hover:bg-muted/80",
    soft: "bg-muted/60 text-foreground [a]:hover:bg-muted/80",
    outline: "border-border text-foreground [a]:hover:bg-muted",
    ghost: "text-muted-foreground [a]:hover:bg-muted/50",
  },
  info: {
    solid: "bg-primary/10 text-primary [a]:hover:bg-primary/15",
    soft: "bg-primary/5 text-primary [a]:hover:bg-primary/10",
    outline: "border-primary/20 text-primary [a]:hover:bg-primary/5",
    ghost: "text-primary [a]:hover:bg-primary/5",
  },
  success: {
    solid: "bg-accent text-accent-foreground [a]:hover:bg-accent/80",
    soft: "bg-accent/60 text-accent-foreground [a]:hover:bg-accent/80",
    outline:
      "border-accent-foreground/20 text-accent-foreground [a]:hover:bg-accent/30",
    ghost: "text-accent-foreground [a]:hover:bg-accent/40",
  },
  warning: {
    solid: "bg-chart-3/10 text-foreground [a]:hover:bg-chart-3/15",
    soft: "bg-chart-3/5 text-foreground [a]:hover:bg-chart-3/10",
    outline: "border-chart-3/30 text-foreground [a]:hover:bg-chart-3/10",
    ghost: "text-foreground [a]:hover:bg-chart-3/10",
  },
  danger: {
    solid:
      "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline:
      "border-destructive/40 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
  forbidden: {
    solid: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline:
      "border-destructive/40 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
  invalid: {
    solid: "bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline:
      "border-destructive/50 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
};

export const densitySpacingClasses: Record<Density, string> = {
  compact: "[--field-spacing:--spacing(2)] [--surface-spacing:--spacing(3)]",
  standard: "[--field-spacing:--spacing(3)] [--surface-spacing:--spacing(4)]",
  comfortable:
    "[--field-spacing:--spacing(4)] [--surface-spacing:--spacing(6)]",
};

export const panelRadiusClasses: Record<GovernedPanelRadius, string> = {
  none: "rounded-none *:[img:first-child]:rounded-t-none *:[img:last-child]:rounded-b-none",
  sm: "rounded-lg *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg",
  md: "rounded-xl *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
  lg: "rounded-2xl *:[img:first-child]:rounded-t-2xl *:[img:last-child]:rounded-b-2xl",
};

export const panelShadowClasses: Record<GovernedPanelShadow, string> = {
  none: "shadow-none ring-0",
  raised: "ring-1 ring-foreground/10",
  overlay: "shadow-lg ring-1 ring-foreground/10",
};

/** @deprecated Use {@link panelRadiusClasses}. */
export const cardRadiusClasses = panelRadiusClasses;

/** @deprecated Use {@link panelShadowClasses}. */
export const cardShadowClasses = panelShadowClasses;

export const formControlSizeClasses: Record<GovernedSize, string> = {
  xs: "gap-1 text-xs [&_[data-slot=control]]:h-7",
  sm: "gap-1.5 text-sm [&_[data-slot=control]]:h-8",
  md: "gap-2 text-sm [&_[data-slot=control]]:h-9",
  lg: "gap-2.5 text-base [&_[data-slot=control]]:h-10",
};

export const tableSizeClasses: Record<GovernedSize, string> = {
  xs: "text-xs [&_[data-slot=table-cell]]:px-2 [&_[data-slot=table-cell]]:py-1",
  sm: "text-sm [&_[data-slot=table-cell]]:px-3 [&_[data-slot=table-cell]]:py-1.5",
  md: "text-sm [&_[data-slot=table-cell]]:px-4 [&_[data-slot=table-cell]]:py-2",
  lg: "text-base [&_[data-slot=table-cell]]:px-4 [&_[data-slot=table-cell]]:py-3",
};

/** Field structural orientation — layout only, owned by recipe maps. */
export const fieldOrientationClasses = {
  vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
  horizontal:
    "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
  responsive:
    "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
} as const;

/** Governed SlotRole class maps for Card subparts. Keys follow {@link SLOT_ROLES}. */
export const cardSlotClassNames = {
  header:
    "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
  content: "px-(--card-spacing)",
  footer:
    "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
  actions: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
  label:
    "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
  body: "text-sm text-muted-foreground",
} as const satisfies SlotClassMap<CardSlotRoleKey>;

/** Governed SlotRole class maps for Alert subparts. Keys follow {@link SLOT_ROLES}. */
export const alertSlotClassNames = {
  label:
    "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
  body: "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
  actions: "absolute top-2 right-2",
} as const satisfies SlotClassMap<AlertSlotRoleKey>;

/** Governed SlotRole class maps for Field subparts. Keys follow {@link SLOT_ROLES}. */
export const fieldSlotClassNames = {
  header:
    "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
  body: "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
  label:
    "mb-1.5 font-medium data-[field-legend-variant=label]:text-sm data-[field-legend-variant=legend]:text-base",
  content: "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
  control:
    "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
  state:
    "text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-field-legend-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
  footer:
    "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
  actions: "text-sm font-normal text-destructive",
} as const satisfies SlotClassMap<FieldSlotRoleKey>;

/** Component-specific Field slot keys that do not map cleanly to a global SlotRole. */
export const fieldSlotClassNamesByKey = {
  title:
    "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
  separatorLine: "absolute inset-0 top-1/2",
  separatorContent:
    "relative mx-auto block w-fit bg-background px-2 text-muted-foreground",
  errorList: "ml-4 flex list-disc flex-col gap-1",
} as const satisfies SlotClassMap<FieldSlotKey>;

/** Leaf form-control size modifiers — owned by governance, keyed by governed size. */
export const formControlLeafSizeClassNames = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-2.5 text-sm",
  md: "h-8 px-2.5 text-sm md:text-sm",
  lg: "h-10 px-3 text-base",
} as const satisfies Record<GovernedSize, string>;

/** Input root presentation — stock shadcn parity, size merged at runtime. */
export const inputRootSlotClassName =
  "w-full min-w-0 rounded-lg border border-input bg-transparent py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

/** Textarea root presentation — stock shadcn parity, size merged at runtime. */
export const textareaRootSlotClassName =
  "field-sizing-content flex min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

/** Label root presentation. */
export const labelRootSlotClassName =
  "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";

/** Checkbox root and indicator presentation. */
export const checkboxRootSlotClassName =
  "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary";

export const checkboxIndicatorSlotClassName =
  "grid place-content-center text-current transition-none [&>svg]:size-3.5";

/** Switch root and thumb presentation. */
export const switchRootSlotClassName =
  "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50";

export const switchThumbSlotClassName =
  "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground";

export const switchSizeClassNamesByKey = {
  "size-sm": "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
  "size-md": "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]",
} as const;

/** Dialog overlay and panel slots. */
export const dialogSlotClassNames = {
  body: "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  root: "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  header: "flex flex-col gap-2",
  footer:
    "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
  label: "font-heading text-base leading-none font-medium",
  state:
    "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
} as const;

export const dialogSlotClassNamesByKey = {
  "close-button": "absolute top-2 right-2",
  "close-label": "sr-only",
} as const;

/** Popover overlay panel slots. */
export const popoverSlotClassNames = {
  root: "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  header: "flex flex-col gap-0.5 text-sm",
  label: "font-medium",
  state: "text-muted-foreground",
} as const;

/** Tooltip content and arrow slots. */
export const tooltipSlotClassNames = {
  root: "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
} as const;

export const tooltipSlotClassNamesByKey = {
  arrow:
    "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground",
} as const;

/** Tabs list, trigger, and content slots. */
export const tabsSlotClassNames = {
  root: "group/tabs flex gap-2 data-horizontal:flex-col",
  header:
    "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  control:
    "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
  content: "flex-1 text-sm outline-none",
} as const;

export const tabsSlotClassNamesByKey = {
  "list-default": "bg-muted",
  "list-line": "gap-1 bg-transparent",
} as const;

/** Select trigger, menu, and item slots. */
export const selectSlotClassNames = {
  control:
    "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  root: "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  body: "scroll-my-1 p-1",
  state: "px-1.5 py-1 text-xs text-muted-foreground",
  label:
    "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
  footer: "pointer-events-none -mx-1 my-1 h-px bg-border",
  icon: "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
} as const;

export const selectSlotClassNamesByKey = {
  "content-popper":
    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
  "trigger-size-sm":
    "data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
  "trigger-size-md": "data-[size=default]:h-8",
  "viewport-popper":
    "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
  "item-indicator":
    "pointer-events-none absolute right-2 flex size-4 items-center justify-center",
  "scroll-down":
    "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
  "trigger-chevron": "pointer-events-none size-4 text-muted-foreground",
  "item-check-icon": "pointer-events-none",
} as const;

/** Dropdown menu content and item slots. */
export const dropdownMenuSlotClassNames = {
  root: "z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  content:
    "z-50 min-w-[96px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  control:
    "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
  state:
    "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
  footer: "-mx-1 my-1 h-px bg-border",
  actions:
    "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
} as const;

export const dropdownMenuSlotClassNamesByKey = {
  "checkbox-item":
    "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "radio-item":
    "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "sub-trigger":
    "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "sub-trigger-chevron": "ml-auto",
  "item-indicator":
    "pointer-events-none absolute right-2 flex items-center justify-center",
} as const;

/** Sheet overlay and panel slots. */
export const sheetSlotClassNames = {
  body: "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  root: "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10",
  header: "flex flex-col gap-0.5 p-4",
  footer: "mt-auto flex flex-col gap-2 p-4",
  label: "font-heading text-base font-medium text-foreground",
  state: "text-sm text-muted-foreground",
} as const;

export const sheetSlotClassNamesByKey = {
  "close-button": "absolute top-3 right-3",
  "close-label": "sr-only",
} as const;

/** Drawer overlay, panel, and handle slots. */
export const drawerSlotClassNames = {
  body: "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  root: "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm",
  header:
    "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left",
  footer: "mt-auto flex flex-col gap-2 p-4",
  label: "font-heading text-base font-medium text-foreground",
  state: "text-sm text-muted-foreground",
} as const;

export const drawerSlotClassNamesByKey = {
  handle:
    "mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block",
} as const;

/** Radio group root and item slots. */
export const radioGroupSlotClassNames = {
  root: "grid w-full gap-2",
  control:
    "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
} as const;

export const radioGroupSlotClassNamesByKey = {
  indicator: "flex size-4 items-center justify-center",
  "indicator-dot":
    "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground",
} as const;

/** Governed SlotRole class maps for Table subparts. Keys follow {@link SLOT_ROLES}. */
export const tableSlotClassNames = {
  header: "[&_[data-slot=table-row]]:border-b",
  content: "[&_[data-slot=table-row]:last-child]:border-0",
  footer:
    "border-t bg-muted/50 font-medium [&_[data-slot=table-row]]:last:border-b-0",
} as const satisfies SlotClassMap<TableSlotRoleKey>;

/** Table-specific slot keys that do not map cleanly to global SlotRole names. */
export const tableSlotClassNamesByKey = {
  container: "relative w-full overflow-x-auto",
  row: "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
  head: "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
  cell: "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
  caption: "mt-4 text-sm text-muted-foreground",
} as const satisfies SlotClassMap<TableSlotKey>;

/** Separator root presentation — stock shadcn parity. */
export const separatorRootSlotClassName =
  "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch";

/** Skeleton root presentation — stock shadcn parity. */
export const skeletonRootSlotClassName = "animate-pulse rounded-md bg-muted";

/** ScrollArea root, viewport, scrollbar, and thumb slots. */
export const scrollAreaSlotClassNames = {
  root: "relative",
  body: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
  control:
    "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
  icon: "relative flex-1 rounded-full bg-border",
} as const;

/** Avatar root, image, fallback, badge, group, and count slots. */
export const avatarSlotClassNames = {
  root: "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
  body: "aspect-square size-full rounded-full object-cover",
  control:
    "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
  icon: "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
  header:
    "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
  state:
    "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
} as const;

/** AlertDialog overlay and panel slots. */
export const alertDialogSlotClassNames = {
  body: "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  root: "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  header:
    "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
  footer:
    "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
  label:
    "font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
  state:
    "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
} as const;

export const alertDialogSlotClassNamesByKey = {
  media:
    "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
} as const;

/** DataTable wrapper presentation — stock shadcn parity. */
export const dataTableRootSlotClassName = "overflow-hidden rounded-md border";

/** DataTable empty-state cell presentation. */
export const dataTableEmptyCellSlotClassName = "h-24 text-center";

/** Toaster root and icon slots. */
export const toasterSlotClassNames = {
  root: "toaster group",
} as const;

export const toasterSlotClassNamesByKey = {
  loading: "size-4 animate-spin",
  success: "size-4",
  info: "size-4",
  warning: "size-4",
  error: "size-4",
} as const;

/** Sonner inline CSS variables — kept in recipe ownership to avoid semantic token strings in components. */
export const toasterInlineStyleVariables = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",
} as const;

/** Context menu content and item slots. */
export const contextMenuSlotClassNames = {
  root: "z-50 max-h-(--radix-context-menu-content-available-height) min-w-36 origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  content:
    "z-50 min-w-32 origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  control:
    "group/context-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
  state:
    "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
  footer: "-mx-1 my-1 h-px bg-border",
  actions:
    "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
} as const;

export const contextMenuSlotClassNamesByKey = {
  trigger: "select-none",
  "checkbox-item":
    "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "radio-item":
    "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "sub-trigger":
    "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "sub-trigger-chevron": "ml-auto",
  "item-indicator": "pointer-events-none absolute right-2",
} as const;

/** Menubar root, trigger, and menu slots. */
export const menubarSlotClassNames = {
  root: "flex h-8 items-center gap-0.5 rounded-lg border p-[3px]",
  control:
    "group/menubar-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
  content:
    "z-50 min-w-36 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
  state: "px-1.5 py-1 text-sm font-medium data-inset:pl-7",
  footer: "-mx-1 my-1 h-px bg-border",
  actions:
    "ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
} as const;

export const menubarSlotClassNamesByKey = {
  trigger:
    "flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted",
  "checkbox-item":
    "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  "radio-item":
    "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "sub-trigger":
    "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
  "sub-trigger-chevron": "ml-auto size-4",
  "sub-content":
    "z-50 min-w-32 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  "item-indicator":
    "pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
} as const;

/** Breadcrumb navigation slots. */
export const breadcrumbSlotClassNames = {
  root: "",
  body: "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
  content: "inline-flex items-center gap-1",
  control: "transition-colors hover:text-foreground",
  label: "font-normal text-foreground",
  icon: "[&>svg]:size-3.5",
  state: "flex size-5 items-center justify-center [&>svg]:size-4",
} as const;

export const breadcrumbSlotClassNamesByKey = {
  "ellipsis-label": "sr-only",
} as const;

/** Pagination navigation slots. */
export const paginationSlotClassNames = {
  root: "mx-auto flex w-full justify-center",
  body: "flex items-center gap-0.5",
  icon: "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
} as const;

export const paginationSlotClassNamesByKey = {
  "link-padding-start": "pl-1.5!",
  "link-padding-end": "pr-1.5!",
  "link-text": "hidden sm:block",
  "ellipsis-label": "sr-only",
} as const;

/** Navigation menu root, trigger, and panel slots. */
export const navigationMenuSlotClassNames = {
  root: "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
  body: "group flex flex-1 list-none items-center justify-center gap-0",
  content: "relative",
  header:
    "top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
  label:
    "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
  state:
    "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
  footer: "absolute top-full left-0 isolate z-50 flex justify-center",
  actions:
    "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 md:w-(--radix-navigation-menu-viewport-width) data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90",
} as const;

/** @deprecated Use {@link navigationMenuSlotClassNamesByKey} trigger-style via governance. */
export const navigationMenuTriggerSlotClassName =
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted";

export const navigationMenuSlotClassNamesByKey = {
  "trigger-style": navigationMenuTriggerSlotClassName,
  "trigger-chevron":
    "relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180",
  "indicator-arrow":
    "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md",
} as const;

/** Button group root and child slots. */
export const buttonGroupRootSlotClassName =
  "group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1";

export const buttonGroupSlotClassNames = {
  root: buttonGroupRootSlotClassName,
  control:
    "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  footer:
    "relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
} as const;

export const buttonGroupSlotClassNamesByKey = {
  "orientation-horizontal":
    "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
  "orientation-vertical":
    "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
} as const;

/** Item list row and media slots. */
export const itemRootSlotClassName =
  "group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted";

export const itemSlotClassNames = {
  root: itemRootSlotClassName,
  body: "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
  control:
    "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  content:
    "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
  label:
    "line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
  state:
    "line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
  actions: "flex items-center gap-2",
  header: "flex basis-full items-center justify-between gap-2",
  footer: "flex basis-full items-center justify-between gap-2",
  icon: "my-2",
} as const;

export const itemSlotClassNamesByKey = {
  "default-default": "border-transparent gap-2.5 px-3 py-2.5",
  "default-sm": "border-transparent gap-2.5 px-3 py-2.5",
  "default-xs":
    "border-transparent gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
  "outline-default": "border-border gap-2.5 px-3 py-2.5",
  "outline-sm": "border-border gap-2.5 px-3 py-2.5",
  "outline-xs":
    "border-border gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
  "muted-default": "border-transparent bg-muted/50 gap-2.5 px-3 py-2.5",
  "muted-sm": "border-transparent bg-muted/50 gap-2.5 px-3 py-2.5",
  "muted-xs":
    "border-transparent bg-muted/50 gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
  "media-default": "bg-transparent",
  "media-icon": "[&_svg:not([class*='size-'])]:size-4",
  "media-image":
    "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
} as const;

/** Toggle root presentation — stock shadcn parity. */
export const toggleRootSlotClassName =
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export type ToggleVariantKey = "default" | "outline";

export type ToggleSizeKey = "default" | "sm" | "lg";

export const toggleVariantClassNames: Record<ToggleVariantKey, string> = {
  default: "bg-transparent",
  outline: "border border-input bg-transparent hover:bg-muted",
};

export const toggleSizeClassNames: Record<ToggleSizeKey, string> = {
  default:
    "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
};

/** ToggleGroup root and item slots. */
export const toggleGroupSlotClassNames = {
  root: "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),12px)] data-vertical:flex-col data-vertical:items-stretch",
  control:
    "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
} as const;

/** Progress root and indicator slots. */
export const progressSlotClassNames = {
  root: "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
  control: "size-full flex-1 bg-primary transition-all",
} as const;

/** Slider root, track, range, and thumb slots. */
export const sliderSlotClassNames = {
  root: "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
  body: "relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1",
  content:
    "absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full",
  control:
    "relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50",
} as const;

/** Accordion root, item, trigger, and content slots. */
export const accordionSlotClassNames = {
  root: "flex w-full flex-col",
  label: "not-last:border-b",
  control:
    "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
  content:
    "overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up",
} as const;

export const accordionSlotClassNamesByKey = {
  header: "flex",
  "content-inner":
    "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
  "trigger-icon-down":
    "pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden",
  "trigger-icon-up":
    "pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline",
} as const;

/** HoverCard content panel slot. */
export const hoverCardSlotClassNames = {
  root: "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
} as const;

/** Kbd root and group slots. */
export const kbdSlotClassNames = {
  root: "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
} as const;

export const kbdSlotClassNamesByKey = {
  group: "inline-flex items-center gap-1",
} as const;

/** Spinner root presentation. */
export const spinnerSlotClassNames = {
  root: "size-4 animate-spin",
} as const;

export type EmptyMediaVariantKey = "default" | "icon";

/** Empty state root and subpart slots. */
export const emptySlotClassNames = {
  root: "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance",
  header: "flex max-w-sm flex-col items-center gap-2",
  icon: "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  label: "font-heading text-sm font-medium tracking-tight",
  body: "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
  content:
    "flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
} as const;

export const emptyMediaVariantClassNames: Record<EmptyMediaVariantKey, string> =
  {
    default: "bg-transparent",
    icon: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
  };

export * from "./recipe-maps-composite";
