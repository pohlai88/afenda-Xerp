import type {
  Density,
  GovernedSize,
  SlotRole,
  StatusTone,
  VariantEmphasis,
  VariantIntent,
} from "./design-system";
import type { GovernedPanelRadius, GovernedPanelShadow } from "./component-props";

type SlotClassMap<TKey extends string> = Readonly<Record<TKey, string>>;

export type CardSlotRoleKey = Extract<
  SlotRole,
  "header" | "content" | "footer" | "actions" | "label" | "body"
>;

export type AlertSlotRoleKey = Extract<SlotRole, "label" | "body" | "actions">;

export type FieldSlotRoleKey = Extract<
  SlotRole,
  "header" | "body" | "label" | "content" | "control" | "state" | "footer" | "actions"
>;

export type FieldSlotKey = "title" | "separatorContent" | "errorList";

export type TableSlotRoleKey = Extract<
  SlotRole,
  "body" | "header" | "content" | "footer" | "label" | "control" | "icon" | "state"
>;

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
    outline: "border-accent-foreground/20 text-accent-foreground [a]:hover:bg-accent/30",
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
    outline: "border-destructive/40 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
  forbidden: {
    solid: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline: "border-destructive/40 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
  invalid: {
    solid: "bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline: "border-destructive/50 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
};

export const densitySpacingClasses: Record<Density, string> = {
  compact: "[--field-spacing:--spacing(2)] [--surface-spacing:--spacing(3)]",
  standard: "[--field-spacing:--spacing(3)] [--surface-spacing:--spacing(4)]",
  comfortable: "[--field-spacing:--spacing(4)] [--surface-spacing:--spacing(6)]",
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
    "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
  content: "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
  control:
    "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
  state:
    "text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
  footer:
    "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
  actions: "text-sm font-normal text-destructive",
} as const satisfies SlotClassMap<FieldSlotRoleKey>;

/** Component-specific Field slot keys that do not map cleanly to a global SlotRole. */
export const fieldSlotClassNamesByKey = {
  title:
    "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
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
  "size-sm":
    "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
  "size-md":
    "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]",
} as const;

/** Governed SlotRole class maps for Table subparts. Keys follow {@link SLOT_ROLES}. */
export const tableSlotClassNames = {
  body: "relative w-full overflow-x-auto",
  header: "[&_[data-slot=table-row]]:border-b",
  content: "[&_[data-slot=table-row]:last-child]:border-0",
  footer: "border-t bg-muted/50 font-medium [&_[data-slot=table-row]]:last:border-b-0",
  label:
    "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
  control:
    "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
  icon: "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
  state: "mt-4 text-sm text-muted-foreground",
} as const satisfies SlotClassMap<TableSlotRoleKey>;
