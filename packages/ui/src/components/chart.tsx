"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
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
    readonly slotKey?: string;
    readonly className?: string | undefined;
  }
) {
  return resolvePrimitiveGovernance({
    componentName: "Chart",
    recipeName: CHART_RECIPE_NAME,
    slot,
    ...(options?.slotKey === undefined ? {} : { slotKey: options.slotKey }),
    ...(options?.className === undefined
      ? {}
      : { className: options.className }),
  });
}

interface ChartContainerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
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
      ...props
    },
    ref
  ) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
    const governed = chartGovernance("root", { className });

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

function ChartTooltipContent({
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
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    readonly hideLabel?: boolean;
    readonly hideIndicator?: boolean;
    readonly indicator?: "line" | "dot" | "dashed";
    readonly nameKey?: string;
    readonly labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
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
        <div
          {...labelClass.dataAttributes}
          className={cn(labelClass.className)}
        >
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return (
      <div {...labelClass.dataAttributes} className={cn(labelClass.className)}>
        {value}
      </div>
    );
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClass.className,
    labelClass.dataAttributes,
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
    <div {...tooltipRoot.dataAttributes} className={cn(tooltipRoot.className)}>
      {nestLabel ? null : tooltipLabel}
      <div {...list.dataAttributes} className={cn(list.className)}>
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

            return (
              <div
                key={index}
                {...rowBase.dataAttributes}
                className={cn(rowBase.className)}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          {...indicatorClasses.dataAttributes}
                          className={cn(
                            indicatorClasses.className,
                            dashedNested?.className
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      {...rowFooter.dataAttributes}
                      className={cn(rowFooter.className)}
                    >
                      <div
                        {...labelGrid.dataAttributes}
                        className={cn(labelGrid.className)}
                      >
                        {nestLabel ? tooltipLabel : null}
                        <span
                          {...itemLabel.dataAttributes}
                          className={cn(itemLabel.className)}
                        >
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span
                          {...itemValue.dataAttributes}
                          className={cn(itemValue.className)}
                        >
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
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  readonly hideIcon?: boolean;
  readonly nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) {
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
    <div {...legendRoot.dataAttributes} className={cn(legendRoot.className)}>
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={index}
              {...legendItem.dataAttributes}
              className={cn(legendItem.className)}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  {...swatch.dataAttributes}
                  className={cn(swatch.className)}
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

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
