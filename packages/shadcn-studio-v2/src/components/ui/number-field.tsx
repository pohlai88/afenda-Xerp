"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./button";
import { inputClassName } from "./input";

export interface NumberFieldProps
  extends Omit<ComponentProps<typeof NumberFieldPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}
export interface NumberFieldGroupProps extends ComponentProps<"div"> {}
export interface NumberFieldInputProps
  extends Omit<ComponentProps<typeof NumberFieldPrimitive.Input>, "className"> {
  readonly className?: string | undefined;
}
export interface NumberFieldIncrementProps
  extends Omit<
    ComponentProps<typeof NumberFieldPrimitive.Increment>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface NumberFieldDecrementProps
  extends Omit<
    ComponentProps<typeof NumberFieldPrimitive.Decrement>,
    "className"
  > {
  readonly className?: string | undefined;
}

const NUMBER_FIELD_BASE_CLASS = "grid gap-2";
const NUMBER_FIELD_GROUP_CLASS = "flex items-center";

export function numberFieldClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NUMBER_FIELD_BASE_CLASS, className);
}

export function numberFieldGroupClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NUMBER_FIELD_GROUP_CLASS, className);
}

export function numberFieldInputClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return inputClassName({ className });
}

export function NumberField({ className, ...props }: NumberFieldProps) {
  return (
    <NumberFieldPrimitive.Root
      {...props}
      className={numberFieldClassName({ className })}
      data-slot="number-field"
    />
  );
}

export function NumberFieldGroup({
  className,
  ...props
}: NumberFieldGroupProps) {
  return (
    <div
      {...props}
      className={numberFieldGroupClassName({ className })}
      data-slot="number-field-group"
    />
  );
}

export function NumberFieldInput({
  className,
  ...props
}: NumberFieldInputProps) {
  return (
    <NumberFieldPrimitive.Input
      {...props}
      className={numberFieldInputClassName({ className })}
      data-slot="number-field-input"
    />
  );
}

export function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldIncrementProps) {
  return (
    <NumberFieldPrimitive.Increment
      {...props}
      className={buttonClassName({
        className: cn("ml-2 size-10 p-0", className),
        size: "icon",
        variant: "outline",
      })}
      data-slot="number-field-increment"
    >
      {children ?? <PlusIcon aria-hidden="true" className="size-4" />}
    </NumberFieldPrimitive.Increment>
  );
}

export function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldDecrementProps) {
  return (
    <NumberFieldPrimitive.Decrement
      {...props}
      className={buttonClassName({
        className: cn("mr-2 size-10 p-0", className),
        size: "icon",
        variant: "outline",
      })}
      data-slot="number-field-decrement"
    >
      {children ?? <MinusIcon aria-hidden="true" className="size-4" />}
    </NumberFieldPrimitive.Decrement>
  );
}
