/** Slot class maps for composite UI primitives (input groups, sidebar, calendar, …). */

export type InputGroupAddonAlignKey =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";

export type InputGroupButtonSizeKey = "xs" | "sm" | "icon-xs" | "icon-sm";

export type SidebarMenuButtonVariantKey = "default" | "outline";

export type SidebarMenuButtonSizeKey = "default" | "sm" | "lg";

export type SidebarGapVariantKey = "sidebar" | "floating";

export type SidebarContainerVariantKey = "sidebar" | "floating";

const inputGroupAddonBaseClassName =
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4";

export const inputGroupAddonAlignClassNames: Record<InputGroupAddonAlignKey, string> =
  {
    "inline-start":
      "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
    "inline-end":
      "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
    "block-start":
      "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
    "block-end":
      "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
  };

export const inputGroupButtonSizeClassNames: Record<InputGroupButtonSizeKey, string> =
  {
    xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
    sm: "",
    "icon-xs":
      "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
    "icon-sm": "size-8 p-0 has-[>svg]:p-0",
  };

export const inputGroupButtonBaseClassName =
  "flex items-center gap-2 text-sm shadow-none";

/** InputGroup root, addon, button, text, and control overlay slots. */
export const inputGroupSlotClassNames = {
  root: "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
  control: inputGroupAddonBaseClassName,
  actions: inputGroupButtonBaseClassName,
  body: "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  state:
    "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
} as const;

export const inputGroupSlotClassNamesByKey = {
  ...Object.fromEntries(
    (
      Object.entries(inputGroupAddonAlignClassNames) as Array<
        [InputGroupAddonAlignKey, string]
      >
    ).map(([align, className]) => [`addon-${align}`, className] as const)
  ),
  ...Object.fromEntries(
    (
      Object.entries(inputGroupButtonSizeClassNames) as Array<
        [InputGroupButtonSizeKey, string]
      >
    ).map(([size, className]) => [`button-${size}`, className] as const)
  ),
  "control-input":
    "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
  "control-textarea":
    "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
} as const;

/** InputOTP root, group, slot, and separator presentation. */
export const inputOtpSlotClassNames = {
  root: "disabled:cursor-not-allowed",
  body: "cn-input-otp flex items-center has-disabled:opacity-50",
  control:
    "relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
  icon: "flex items-center [&_svg:not([class*='size-'])]:size-4",
} as const;

export const inputOtpSlotClassNamesByKey = {
  "group-shell":
    "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
  "caret-blink":
    "pointer-events-none absolute inset-0 flex items-center justify-center",
  "caret-line": "h-4 w-px animate-caret-blink bg-foreground duration-1000",
} as const;

/** NativeSelect wrapper, control, and option slots. */
export const nativeSelectSlotClassNames = {
  root: "group/native-select relative w-fit has-[select:disabled]:opacity-50",
  control:
    "h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  state: "bg-[Canvas] text-[CanvasText]",
} as const;

export const nativeSelectSlotClassNamesByKey = {
  icon: "pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none",
  optgroup: "bg-[Canvas] text-[CanvasText]",
} as const;

/** Command palette root, list, item, and input slots. */
export const commandSlotClassNames = {
  root: "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
  body: "p-1 pb-0",
  control:
    "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
  content:
    "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
  state: "py-6 text-center text-sm",
  label:
    "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
  footer: "-mx-1 h-px bg-border",
  actions:
    "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
  header:
    "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
} as const;

export const commandSlotClassNamesByKey = {
  "dialog-content":
    "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
  "dialog-header-sr": "sr-only",
  "input-group-shell":
    "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!",
  "item-check":
    "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100",
  "input-search-icon": "size-4 shrink-0 opacity-50",
} as const;

/** Combobox trigger, content, list, and chip slots. */
export const comboboxSlotClassNames = {
  root: "[&_svg:not([class*='size-'])]:size-4",
  body: "group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  content:
    "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
  control:
    "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  state: "px-2 py-1.5 text-xs text-muted-foreground",
  footer: "-mx-1 my-1 h-px bg-border",
  label:
    "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
  actions:
    "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
  header:
    "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
  icon: "min-w-16 flex-1 outline-none",
} as const;

export const comboboxSlotClassNamesByKey = {
  positioner: "isolate z-50",
  "trigger-chevron": "pointer-events-none size-4 text-muted-foreground",
  "item-indicator":
    "pointer-events-none absolute right-2 flex size-4 items-center justify-center",
  "chip-remove": "-ml-1 opacity-50 hover:opacity-100",
  "clear-icon": "pointer-events-none",
  "check-icon": "pointer-events-none",
  "chip-remove-icon": "pointer-events-none",
  "input-group-shell": "w-auto",
  "input-group-button":
    "group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent",
} as const;

/** Carousel root, track, item, and navigation slots. */
export const carouselSlotClassNames = {
  root: "relative",
  body: "overflow-hidden",
  content: "flex",
  label: "min-w-0 shrink-0 grow-0 basis-full",
  control: "absolute touch-manipulation rounded-full",
} as const;

export const carouselSlotClassNamesByKey = {
  "content-horizontal": "-ml-4",
  "content-vertical": "-mt-4 flex-col",
  "item-horizontal": "pl-4",
  "item-vertical": "pt-4",
  "previous-horizontal": "inset-y-0 -left-12 my-auto",
  "previous-vertical": "-top-12 left-1/2 -translate-x-1/2 rotate-90",
  "next-horizontal": "inset-y-0 -right-12 my-auto",
  "next-vertical": "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
  "sr-only": "sr-only",
} as const;

/** Chart container, tooltip, and legend slots. */
export const chartSlotClassNames = {
  root: "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
  body: "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
  content: "grid gap-1.5",
  control:
    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
  label: "font-medium",
  state: "text-muted-foreground",
  actions: "font-mono font-medium text-foreground tabular-nums",
  header: "flex items-center justify-center gap-4",
  icon: "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
  footer: "flex flex-1 justify-between leading-none",
} as const;

export const chartSlotClassNamesByKey = {
  "tooltip-row-dot": "items-center",
  "tooltip-row-default": "",
  "tooltip-label-end": "items-end",
  "tooltip-label-center": "items-center",
  "tooltip-label-grid": "grid gap-1.5",
  "indicator-dot":
    "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg) h-2.5 w-2.5",
  "indicator-line":
    "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg) w-1",
  "indicator-dashed":
    "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg) w-0 border-[1.5px] border-dashed bg-transparent",
  "indicator-dashed-nested": "my-0.5",
  "legend-top": "pb-3",
  "legend-bottom": "pt-3",
  "legend-swatch": "h-2 w-2 shrink-0 rounded-[2px]",
} as const;

/** Resizable panel group, panel, and handle slots. */
export const resizableSlotClassNames = {
  root: "flex h-full w-full aria-[orientation=vertical]:flex-col",
  body: "",
  control:
    "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
} as const;

export const resizableSlotClassNamesByKey = {
  "handle-grip": "z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border",
} as const;

const sidebarMenuButtonBaseClassName =
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate";

export const sidebarMenuButtonVariantClassNames: Record<
  SidebarMenuButtonVariantKey,
  string
> = {
  default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  outline:
    "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
};

export const sidebarMenuButtonSizeClassNames: Record<
  SidebarMenuButtonSizeKey,
  string
> = {
  default: "h-8 text-sm",
  sm: "h-7 text-xs",
  lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
};

/** Sidebar shell, menu, and inset slots. */
export const sidebarSlotClassNames = {
  root: "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
  body: "group peer hidden text-sidebar-foreground md:block",
  content: "flex h-full w-full flex-col",
  header: "flex flex-col gap-2 p-2",
  footer: "flex flex-col gap-2 p-2",
  label:
    "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  control:
    "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
  state: "w-full text-sm",
  actions: "flex w-full min-w-0 flex-col gap-0",
  icon: "group/menu-item relative",
} as const;

export const sidebarGapVariantClassNames: Record<SidebarGapVariantKey, string> = {
  sidebar: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
  floating:
    "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]",
};

export const sidebarContainerVariantClassNames: Record<
  SidebarContainerVariantKey,
  string
> = {
  sidebar:
    "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
  floating:
    "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]",
};

export const sidebarSlotClassNamesByKey = {
  sidebar:
    "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
  "mobile-content":
    "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
  "mobile-inner": "flex h-full w-full flex-col",
  "mobile-header": "sr-only",
  gap: "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180",
  "gap-floating":
    "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]",
  "gap-sidebar": "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
  container:
    "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
  "container-floating":
    "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]",
  "container-sidebar":
    "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
  inner:
    "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border",
  rail: "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
  inset:
    "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
  input: "h-8 w-full bg-background shadow-none",
  separator: "mx-2 w-auto bg-sidebar-border",
  "content-scroll":
    "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
  group: "relative flex w-full min-w-0 flex-col p-2",
  "menu-action":
    "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
  "menu-action-hover":
    "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
  "menu-badge":
    "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground",
  "menu-skeleton": "flex h-8 items-center gap-2 rounded-md px-2",
  "menu-skeleton-icon": "size-4 rounded-md",
  "menu-skeleton-text": "h-4 max-w-(--skeleton-width) flex-1",
  "menu-sub":
    "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
  "menu-sub-item": "group/menu-sub-item relative",
  "menu-sub-button":
    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
  trigger: "shrink-0",
  "sr-only": "sr-only",
  ...Object.fromEntries(
    (
      Object.entries(sidebarMenuButtonVariantClassNames) as Array<
        [SidebarMenuButtonVariantKey, string]
      >
    ).flatMap(([variant, variantClassName]) =>
      (
        Object.entries(sidebarMenuButtonSizeClassNames) as Array<
          [SidebarMenuButtonSizeKey, string]
        >
      ).map(
        ([size, sizeClassName]) =>
          [
            `menu-button-${variant}-${size}`,
            `${sidebarMenuButtonBaseClassName} ${variantClassName} ${sizeClassName}`,
          ] as const
      )
    )
  ),
} as const;

/** Calendar DayPicker class name keys — owned by governance recipe maps. */
export const calendarSlotClassNamesByKey = {
  root: "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
  "root-rtl-previous": String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
  "root-rtl-next": String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
  "picker-root": "w-fit",
  months: "relative flex flex-col gap-4 md:flex-row",
  month: "flex w-full flex-col gap-4",
  nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
  "nav-button":
    "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
  month_caption:
    "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
  dropdowns:
    "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
  dropdown_root: "relative rounded-(--cell-radius)",
  dropdown: "absolute inset-0 bg-popover opacity-0",
  "caption_label-default": "font-medium select-none text-sm",
  "caption_label-dropdown":
    "font-medium select-none flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday:
    "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
  week: "mt-2 flex w-full",
  week_number_header: "w-(--cell-size) select-none",
  week_number: "text-[0.8rem] text-muted-foreground select-none",
  day: "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
  "day-with-week-number":
    "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)",
  "day-without-week-number":
    "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
  range_start:
    "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
  range_middle: "rounded-none",
  range_end:
    "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
  today:
    "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
  outside: "text-muted-foreground aria-selected:text-muted-foreground",
  disabled: "text-muted-foreground opacity-50",
  hidden: "invisible",
  "week-number-inner":
    "flex size-(--cell-size) items-center justify-center text-center",
  "chevron-icon": "size-4",
  "day-button":
    "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
} as const;

export const calendarSlotClassNames = {
  root: "",
} as const;
