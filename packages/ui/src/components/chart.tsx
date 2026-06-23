"use client";

import type { GovernedChartProps } from "@afenda/ui/governance";
import {
  applyGovernedPresentation,
  mergeGovernedPresentation,
} from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";
import type { TooltipValueType } from "recharts";
import * as RechartsPrimitive from "recharts";

const CHART_RECIPE_NAME = "surface" as const;

const THEMES = { light: "", dark: ".dark" } as const;

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
type TooltipNameType = number | string;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

type ChartTooltipIndicator = "line" | "dot" | "dashed";

export type ChartTooltipContentProps = React.ComponentProps<
  typeof RechartsPrimitive.Tooltip
> &
  React.ComponentProps<"div"> & {
    readonly hideIndicator?: boolean;
    readonly hideLabel?: boolean;
    readonly indicator?: ChartTooltipIndicator;
    readonly labelClassName?: string;
    readonly nameKey?: string;
    readonly labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >;

export type ChartLegendContentProps = React.ComponentProps<"div"> & {
  readonly hideIcon?: boolean;
  readonly nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps;

interface ChartContextProps {
  readonly config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function chartGovernance(
  slot: Parameters<typeof resolvePrimitiveGovernance>[0]["slot"],
  options?: {
    readonly className?: string | undefined;
    readonly slotKey?: string;
    readonly state?: GovernedChartProps["state"];
  }
) {
  return resolvePrimitiveGovernance({
    componentName: "Chart",
    recipeName: CHART_RECIPE_NAME,
    slot,
    ...(options?.state === undefined ? {} : { state: options.state }),
    ...(options?.slotKey === undefined ? {} : { slotKey: options.slotKey }),
    ...(options?.className === undefined
      ? {}
      : { className: options.className }),
  });
}

export interface ChartContainerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className">,
    GovernedChartProps {
  readonly children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  readonly className?: string;
  readonly config: ChartConfig;
  readonly id?: string;
  readonly initialDimension?: {
    readonly width: number;
    readonly height: number;
  };
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      id,
      className,
      children,
      config,
      initialDimension = INITIAL_DIMENSION,
      state,
      ...props
    },
    ref
  ) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
    const governed = chartGovernance("root", { className, state });

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          {...applyGovernedPresentation(props, governed, {
            "data-chart": chartId,
          })}
        >
          <ChartStyle config={config} id={chartId} />
          <RechartsPrimitive.ResponsiveContainer
            initialDimension={initialDimension}
          >
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);

ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({
  id,
  config,
}: {
  readonly id: string;
  readonly config: ChartConfig;
}) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme ?? itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(function ChartTooltipContent(
  {
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  },
  ref
) {
  const { config } = useChart();

  const labelClass = chartGovernance("label", { className: labelClassName });

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div {...applyGovernedPresentation({}, labelClass)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return (
      <div {...applyGovernedPresentation({}, labelClass)}>{value}</div>
    );
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClass,
    config,
    labelKey,
  ]);

  if (!(active && payload?.length)) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";
  const tooltipRoot = chartGovernance("body", { className });
  const list = chartGovernance("content");
  const rowBase = chartGovernance("control", {
    slotKey: indicator === "dot" ? "tooltip-row-dot" : "tooltip-row-default",
  });
  const rowFooter = chartGovernance("footer", {
    slotKey: nestLabel ? "tooltip-label-end" : "tooltip-label-center",
  });
  const labelGrid = chartGovernance("content", {
    slotKey: "tooltip-label-grid",
  });
  const itemLabel = chartGovernance("state");
  const itemValue = chartGovernance("actions");

  const indicatorClassKey =
    indicator === "dot"
      ? "indicator-dot"
      : indicator === "line"
        ? "indicator-line"
        : "indicator-dashed";

  return (
    <div ref={ref} {...applyGovernedPresentation({}, tooltipRoot)}>
      {nestLabel ? null : tooltipLabel}
      <div {...applyGovernedPresentation({}, list)}>
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload?.fill ?? item.color;
            const indicatorClasses = chartGovernance("control", {
              slotKey: indicatorClassKey,
            });
            const dashedNested =
              nestLabel && indicator === "dashed"
                ? chartGovernance("control", {
                    slotKey: "indicator-dashed-nested",
                  })
                : null;
            const indicatorPresentation = dashedNested
              ? mergeGovernedPresentation(indicatorClasses, dashedNested)
              : indicatorClasses;

            return (
              <div key={index} {...applyGovernedPresentation({}, rowBase)}>
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          {...applyGovernedPresentation({}, indicatorPresentation)}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div {...applyGovernedPresentation({}, rowFooter)}>
                      <div {...applyGovernedPresentation({}, labelGrid)}>
                        {nestLabel ? tooltipLabel : null}
                        <span {...applyGovernedPresentation({}, itemLabel)}>
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span {...applyGovernedPresentation({}, itemValue)}>
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
});

ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(function ChartLegendContent(
  {
    className,
    hideIcon = false,
    payload,
    verticalAlign = "bottom",
    nameKey,
  },
  ref
) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  const legendRoot = chartGovernance("header", {
    slotKey: verticalAlign === "top" ? "legend-top" : "legend-bottom",
    className,
  });
  const legendItem = chartGovernance("icon");
  const swatch = chartGovernance("icon", { slotKey: "legend-swatch" });

  return (
    <div ref={ref} {...applyGovernedPresentation({}, legendRoot)}>
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div key={index} {...applyGovernedPresentation({}, legendItem)}>
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  {...applyGovernedPresentation({}, swatch)}
                  style={
                    {
                      "--color-bg": item.color,
                    } as React.CSSProperties
                  }
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
});

ChartLegendContent.displayName = "ChartLegendContent";

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
