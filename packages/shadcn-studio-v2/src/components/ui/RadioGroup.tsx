"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface RadioGroupProps
  extends Omit<ComponentProps<typeof RadioGroupPrimitive>, "className"> {
  readonly className?: string | undefined;
}
export interface RadioGroupItemProps
  extends Omit<ComponentProps<typeof RadioPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}

const RADIO_GROUP_BASE_CLASS = "grid gap-3";
const RADIO_GROUP_ITEM_BASE_CLASS =
  "aspect-square size-4 rounded-full border border-primary text-primary shadow-xs outline-none transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function radioGroupClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(RADIO_GROUP_BASE_CLASS, className);
}

export function radioGroupItemClassName({
  className,
}: {
  readonly className?: string | undefined;
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
