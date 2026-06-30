"use client";

import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

const DEFAULT_BAR_COLOR = "bg-muted";

const getMarkerBgColor = (
  marker: number | undefined,
  values: number[],
  colors: string[]
): string => {
  if (marker === undefined) return "";

  if (marker === 0) {
    for (let index = 0; index < values.length; index++) {
      const segment = values[index];
      if (segment !== undefined && segment > 0) {
        return colors[index] ?? DEFAULT_BAR_COLOR;
      }
    }
  }

  let prefixSum = 0;

  for (let index = 0; index < values.length; index++) {
    const segment = values[index] ?? 0;
    prefixSum += segment;

    if (prefixSum >= marker) {
      return colors[index] ?? DEFAULT_BAR_COLOR;
    }
  }

  return colors[values.length - 1] ?? DEFAULT_BAR_COLOR;
};

const getPositionLeft = (
  value: number | undefined,
  maxValue: number
): number => (value ? (value / maxValue) * 100 : 0);

const sumNumericArray = (arr: number[]) =>
  arr.reduce((prefixSum, num) => prefixSum + num, 0);

const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString();
  }

  return num.toFixed(1);
};

const BarLabels = ({ values }: { values: number[] }) => {
  const sumValues = React.useMemo(() => sumNumericArray(values), [values]);
  let prefixSum = 0;
  let sumConsecutiveHiddenLabels = 0;

  return (
    <div
      className={cn(
        "relative mb-2 flex h-5 w-full font-medium text-sm",

        // text color
        "text-muted-foreground"
      )}
    >
      <div className="absolute bottom-0 left-0 flex items-center">0</div>
      {values.map((widthPercentage, index) => {
        prefixSum += widthPercentage;

        const showLabel =
          (widthPercentage >= 0.1 * sumValues ||
            sumConsecutiveHiddenLabels >= 0.09 * sumValues) &&
          sumValues - prefixSum >= 0.1 * sumValues &&
          prefixSum >= 0.1 * sumValues &&
          prefixSum < 0.9 * sumValues;

        sumConsecutiveHiddenLabels = showLabel
          ? 0
          : (sumConsecutiveHiddenLabels += widthPercentage);

        const widthPositionLeft = getPositionLeft(widthPercentage, sumValues);

        return (
          <div
            className="flex items-center justify-end pr-0.5"
            key={`item-${index}`}
            style={{ width: `${widthPositionLeft}%` }}
          >
            {showLabel ? (
              <span
                className={cn("block translate-x-1/2 text-sm tabular-nums")}
              >
                {formatNumber(prefixSum)}
              </span>
            ) : null}
          </div>
        );
      })}
      <div className="absolute right-0 bottom-0 flex items-center">
        {formatNumber(sumValues)}
      </div>
    </div>
  );
};

interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  marker?: { value: number; tooltip?: string; showAnimation?: boolean };
  showLabels?: boolean;
  values: number[];
}

const CategoryBar = ({
  values = [],
  colors = [],
  marker,
  showLabels = true,
  className,
  ref: forwardedRef,
  ...props
}: CategoryBarProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const markerBgColor = React.useMemo(
    () => getMarkerBgColor(marker?.value, values, colors),
    [marker, values, colors]
  );

  const maxValue = React.useMemo(() => sumNumericArray(values), [values]);

  const adjustedMarkerValue = React.useMemo(() => {
    if (marker === undefined) return;
    if (marker.value < 0) return 0;
    if (marker.value > maxValue) return maxValue;

    return marker.value;
  }, [marker, maxValue]);

  const markerPositionLeft: number = React.useMemo(
    () => getPositionLeft(adjustedMarkerValue, maxValue),
    [adjustedMarkerValue, maxValue]
  );

  return (
    <div
      aria-label="Category bar"
      aria-valuenow={marker?.value}
      className={cn(className)}
      ref={forwardedRef}
      {...props}
    >
      {showLabels ? <BarLabels values={values} /> : null}
      <div className="relative flex h-2 w-full items-center">
        <div
          className={cn(
            "flex h-full flex-1 items-center overflow-hidden rounded-full",
            showLabels ? "gap-0.5" : ""
          )}
        >
          {values.map((value, index) => {
            const barColor = colors[index] ?? DEFAULT_BAR_COLOR;
            const percentage = (value / maxValue) * 100;

            return (
              <div
                className={cn("h-full", barColor, percentage === 0 && "hidden")}
                key={`item-${index}`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>

        {marker === undefined ? null : (
          <div
            className={cn(
              "absolute w-2 -translate-x-1/2",
              marker.showAnimation &&
                "transform-gpu transition-all duration-300 ease-in-out"
            )}
            style={{
              left: `${markerPositionLeft}%`,
            }}
          >
            {marker.tooltip ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <div
                      aria-hidden="true"
                      className={cn(
                        "relative mx-auto h-4 w-1 rounded-full ring-2",
                        "ring-background",
                        markerBgColor
                      )}
                    >
                      <div
                        aria-hidden
                        className="absolute size-7 -translate-x-[45%] -translate-y-[15%]"
                      />
                    </div>
                  }
                />
                <TooltipContent>{marker.tooltip}</TooltipContent>
              </Tooltip>
            ) : (
              <div
                className={cn(
                  "mx-auto h-4 w-1 rounded-full ring-2",
                  "ring-background",
                  markerBgColor
                )}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CategoryBar.displayName = "CategoryBar";

export { CategoryBar, type CategoryBarProps };
