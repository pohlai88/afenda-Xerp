// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface RadioGroupProps
  extends ComponentProps<typeof RadioGroupPrimitive> {}
export interface RadioGroupItemProps
  extends ComponentProps<typeof RadioPrimitive.Root> {}

const RADIO_GROUP_BASE_CLASS = "grid gap-3";
const RADIO_GROUP_ITEM_BASE_CLASS =
  "aspect-square size-4 rounded-full border border-primary text-primary shadow-xs outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function radioGroupClassName({
  className,
}: {
  readonly className?: string;
} = {}): string {
  return cn(RADIO_GROUP_BASE_CLASS, className);
}

export function radioGroupItemClassName({
  className,
}: {
  readonly className?: string;
} = {}): string {
  return cn(RADIO_GROUP_ITEM_BASE_CLASS, className);
}

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      {...props}
      className={radioGroupClassName({ className })}
      data-slot="radio-group"
    />
  );
}

export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      {...props}
      className={radioGroupItemClassName({ className })}
      data-slot="radio-group-item"
    >
      <RadioPrimitive.Indicator
        className="relative flex size-full items-center justify-center"
        data-slot="radio-group-indicator"
      >
        <span className="size-2 rounded-full bg-current" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}
