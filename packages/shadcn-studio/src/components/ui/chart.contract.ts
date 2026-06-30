/** Vendor boundary: recharts — adapter owns styling; do not fork vendor internals. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CHART_PRIMITIVE_ID = "shadcn-studio.ui.chart" as const;
export type ChartPrimitiveId = typeof CHART_PRIMITIVE_ID;

export const CHART_SLOTS = {
  root: "chart",
} as const;

export type ChartSlotMap = typeof CHART_SLOTS;
export type ChartSlot = ChartSlotMap[keyof ChartSlotMap];

export const CHART_THEMES = { light: "", dark: ".dark" } as const;

export const CHART_INITIAL_DIMENSION = { width: 320, height: 200 } as const;

export const chartContainerClassName =
  "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden" as const;

export const chartTooltipContentClassName =
  "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl" as const;

export const chartTooltipLabelClassName = "font-medium" as const;

export const chartTooltipItemsClassName = "grid gap-1.5" as const;

export const chartTooltipRowClassName =
  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground" as const;

export const chartTooltipRowDotClassName = "items-center" as const;

export const chartTooltipIndicatorClassName =
  "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)" as const;

export const chartTooltipIndicatorDotClassName = "h-2.5 w-2.5" as const;

export const chartTooltipIndicatorLineClassName = "w-1" as const;

export const chartTooltipIndicatorDashedClassName =
  "w-0 border-[1.5px] border-dashed bg-transparent" as const;

export const chartTooltipIndicatorDashedNestClassName = "my-0.5" as const;

export const chartTooltipValueRowClassName =
  "flex flex-1 justify-between leading-none" as const;

export const chartTooltipValueRowNestEndClassName = "items-end" as const;

export const chartTooltipValueRowCenterClassName = "items-center" as const;

export const chartTooltipValueLabelGridClassName = "grid gap-1.5" as const;

export const chartTooltipValueNameClassName = "text-muted-foreground" as const;

export const chartTooltipValueAmountClassName =
  "font-medium font-mono text-foreground tabular-nums" as const;

export const chartLegendContentClassName =
  "flex items-center justify-center gap-4" as const;

export const chartLegendContentTopClassName = "pb-3" as const;

export const chartLegendContentBottomClassName = "pt-3" as const;

export const chartLegendItemClassName =
  "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground" as const;

export const chartLegendSwatchClassName =
  "h-2 w-2 shrink-0 rounded-[2px]" as const;

export function chartPrimitiveMetadata() {
  return {
    id: CHART_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CHART_SLOTS,
  } as const;
}
