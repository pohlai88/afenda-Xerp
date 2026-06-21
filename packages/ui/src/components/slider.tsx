"use client";

import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";

const SLIDER_RECIPE_NAME = "form-control" as const;

export interface SliderProps
  extends Omit<React.ComponentProps<typeof SliderPrimitive.Root>, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    { className, state, defaultValue, value, min = 0, max = 100, ...props },
    ref
  ) => {
    const _values = React.useMemo(
      () =>
        Array.isArray(value)
          ? value
          : Array.isArray(defaultValue)
            ? defaultValue
            : [min, max],
      [value, defaultValue, min, max]
    );

    const governed = resolvePrimitiveGovernance({
      componentName: "Slider",
      recipeName: SLIDER_RECIPE_NAME,
      state,
      slot: "root",
      className,
    });

    const track = resolvePrimitiveGovernance({
      componentName: "Slider",
      recipeName: SLIDER_RECIPE_NAME,
      slot: "body",
    });

    const range = resolvePrimitiveGovernance({
      componentName: "Slider",
      recipeName: SLIDER_RECIPE_NAME,
      slot: "content",
    });

    const thumb = resolvePrimitiveGovernance({
      componentName: "Slider",
      recipeName: SLIDER_RECIPE_NAME,
      slot: "control",
    });

    return (
      <SliderPrimitive.Root
        ref={ref}
        {...applyGovernedPresentation(
          {
            ...props,
            ...(defaultValue === undefined ? {} : { defaultValue }),
            ...(value === undefined ? {} : { value }),
            min,
            max,
          },
          governed
        )}
      >
        <SliderPrimitive.Track
          {...track.dataAttributes}
          className={cn(track.className)}
        >
          <SliderPrimitive.Range
            {...range.dataAttributes}
            className={cn(range.className)}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            {...thumb.dataAttributes}
            className={cn(thumb.className)}
            key={index}
          />
        ))}
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
