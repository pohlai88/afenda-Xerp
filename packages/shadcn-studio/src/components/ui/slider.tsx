import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  SLIDER_SLOTS,
  sliderControlClassName,
  sliderRangeClassName,
  sliderRootClassName,
  sliderThumbClassName,
  sliderTrackClassName,
} from "./slider.contract.js";

type SliderProps = WithoutGovernedDataSlot<SliderPrimitive.Root.Props>;

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      {...props}
      className={cn(sliderRootClassName, className)}
      data-slot={SLIDER_SLOTS.root}
      defaultValue={defaultValue}
      max={max}
      min={min}
      thumbAlignment="edge"
      value={value}
    >
      <SliderPrimitive.Control
        className={sliderControlClassName}
        data-slot={SLIDER_SLOTS.control}
      >
        <SliderPrimitive.Track
          className={sliderTrackClassName}
          data-slot={SLIDER_SLOTS.track}
        >
          <SliderPrimitive.Indicator
            className={sliderRangeClassName}
            data-slot={SLIDER_SLOTS.range}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            className={sliderThumbClassName}
            data-slot={SLIDER_SLOTS.thumb}
            key={index}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export type { SliderSlot } from "./slider.contract.js";
export type { SliderProps };
export { Slider };
