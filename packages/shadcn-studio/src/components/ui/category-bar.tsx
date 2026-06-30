"use client";

import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  CATEGORY_BAR_SLOTS,
  categoryBarDefaultBarColor,
  categoryBarLabelSegmentClassName,
  categoryBarLabelsClassName,
  categoryBarLabelsEndClassName,
  categoryBarLabelsStartClassName,
  categoryBarLabelValueClassName,
  categoryBarMarkerAnimatedClassName,
  categoryBarMarkerClassName,
  categoryBarMarkerIndicatorClassName,
  categoryBarMarkerIndicatorHitAreaClassName,
  categoryBarMarkerIndicatorStaticClassName,
  categoryBarRootClassName,
  categoryBarSegmentClassName,
  categoryBarSegmentHiddenClassName,
  categoryBarTrackClassName,
  categoryBarTrackRowClassName,
  categoryBarTrackWithLabelsClassName,
} from "./category-bar.contract.js";

const getMarkerBgColor = (
  marker: number | undefined,
  values: number[],
  colors: string[]
): string => {
  if (marker === undefined) {
    return "";
  }

  if (marker === 0) {
    for (const [index, segment] of values.entries()) {
      if (segment > 0) {
        return colors[index] ?? categoryBarDefaultBarColor;
      }
    }
  }

  let prefixSum = 0;

  for (const [index, segment] of values.entries()) {
    prefixSum += segment;

    if (prefixSum >= marker) {
      return colors[index] ?? categoryBarDefaultBarColor;
    }
  }

  return colors.at(-1) ?? categoryBarDefaultBarColor;
};

const getPositionLeft = (
  value: number | undefined,
  maxValue: number
): number => (value ? (value / maxValue) * 100 : 0);

const sumNumericArray = (values: number[]) =>
  values.reduce((prefixSum, value) => prefixSum + value, 0);

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? value.toString() : value.toFixed(1);

type CategoryBarProps = WithoutGovernedDataSlot<
  React.HTMLAttributes<HTMLDivElement> & {
    colors?: string[];
    marker?: { value: number; tooltip?: string; showAnimation?: boolean };
    showLabels?: boolean;
    values: number[];
  }
>;

function BarLabels({ values }: { values: number[] }) {
  const sumValues = React.useMemo(() => sumNumericArray(values), [values]);
  let prefixSum = 0;
  let sumConsecutiveHiddenLabels = 0;

  return (
    <div
      className={categoryBarLabelsClassName}
      data-slot={CATEGORY_BAR_SLOTS.labels}
    >
      <div className={categoryBarLabelsStartClassName}>0</div>
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
          : sumConsecutiveHiddenLabels + widthPercentage;

        const widthPositionLeft = getPositionLeft(widthPercentage, sumValues);

        return (
          <div
            className={categoryBarLabelSegmentClassName}
            key={`category-bar-label-${index}`}
            style={{ width: `${widthPositionLeft}%` }}
          >
            {showLabel ? (
              <span className={categoryBarLabelValueClassName}>
                {formatNumber(prefixSum)}
              </span>
            ) : null}
          </div>
        );
      })}
      <div className={categoryBarLabelsEndClassName}>
        {formatNumber(sumValues)}
      </div>
    </div>
  );
}

function CategoryBar({
  values = [],
  colors = [],
  marker,
  showLabels = true,
  className,
  ...props
}: CategoryBarProps) {
  const markerBgColor = React.useMemo(
    () => getMarkerBgColor(marker?.value, values, colors),
    [marker, values, colors]
  );

  const maxValue = React.useMemo(() => sumNumericArray(values), [values]);

  const adjustedMarkerValue = React.useMemo(() => {
    if (marker === undefined) {
      return;
    }
    if (marker.value < 0) {
      return 0;
    }
    if (marker.value > maxValue) {
      return maxValue;
    }

    return marker.value;
  }, [marker, maxValue]);

  const markerPositionLeft = React.useMemo(
    () => getPositionLeft(adjustedMarkerValue, maxValue),
    [adjustedMarkerValue, maxValue]
  );

  return (
    <div
      {...props}
      aria-label="Category bar"
      aria-valuenow={marker?.value}
      className={cn(categoryBarRootClassName, className)}
      data-slot={CATEGORY_BAR_SLOTS.root}
    >
      {showLabels ? <BarLabels values={values} /> : null}
      <div className={categoryBarTrackRowClassName}>
        <div
          className={cn(
            categoryBarTrackClassName,
            showLabels ? categoryBarTrackWithLabelsClassName : undefined
          )}
          data-slot={CATEGORY_BAR_SLOTS.track}
        >
          {values.map((value, index) => {
            const barColor = colors[index] ?? categoryBarDefaultBarColor;
            const percentage = maxValue === 0 ? 0 : (value / maxValue) * 100;

            return (
              <div
                className={cn(
                  categoryBarSegmentClassName,
                  barColor,
                  percentage === 0
                    ? categoryBarSegmentHiddenClassName
                    : undefined
                )}
                data-slot={CATEGORY_BAR_SLOTS.segment}
                key={`category-bar-segment-${index}`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>

        {marker === undefined ? null : (
          <div
            className={cn(
              categoryBarMarkerClassName,
              marker.showAnimation
                ? categoryBarMarkerAnimatedClassName
                : undefined
            )}
            data-slot={CATEGORY_BAR_SLOTS.marker}
            style={{ left: `${markerPositionLeft}%` }}
          >
            {marker.tooltip ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <div
                      aria-hidden="true"
                      className={cn(
                        categoryBarMarkerIndicatorClassName,
                        markerBgColor
                      )}
                    >
                      <div
                        aria-hidden
                        className={categoryBarMarkerIndicatorHitAreaClassName}
                      />
                    </div>
                  }
                />
                <TooltipContent>{marker.tooltip}</TooltipContent>
              </Tooltip>
            ) : (
              <div
                className={cn(
                  categoryBarMarkerIndicatorStaticClassName,
                  markerBgColor
                )}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

CategoryBar.displayName = "CategoryBar";

export type { CategoryBarSlot } from "./category-bar.contract.js";
export type { CategoryBarProps };
export { CategoryBar };
