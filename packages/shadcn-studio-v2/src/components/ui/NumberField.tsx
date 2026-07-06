// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./Button";

export interface NumberFieldProps
  extends ComponentProps<typeof NumberFieldPrimitive.Root> {}
export interface NumberFieldGroupProps extends ComponentProps<"div"> {}
export interface NumberFieldInputProps
  extends ComponentProps<typeof NumberFieldPrimitive.Input> {}
export interface NumberFieldIncrementProps
  extends ComponentProps<typeof NumberFieldPrimitive.Increment> {}
export interface NumberFieldDecrementProps
  extends ComponentProps<typeof NumberFieldPrimitive.Decrement> {}

export function NumberField({ className, ...props }: NumberFieldProps) {
  return (
    <NumberFieldPrimitive.Root
      {...props}
      className={cn(
        "grid gap-2",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn("flex items-center", className)}
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
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        typeof className === "string" ? className : undefined
      )}
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
        className: cn(
          "ml-2 size-10 p-0",
          typeof className === "string" ? className : undefined
        ),
        size: "icon",
        variant: "outline",
      })}
      data-slot="number-field-increment"
    >
      {children ?? <PlusIcon className="size-4" />}
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
        className: cn(
          "mr-2 size-10 p-0",
          typeof className === "string" ? className : undefined
        ),
        size: "icon",
        variant: "outline",
      })}
      data-slot="number-field-decrement"
    >
      {children ?? <MinusIcon className="size-4" />}
    </NumberFieldPrimitive.Decrement>
  );
}
