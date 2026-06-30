"use client";

import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  INPUT_GROUP_SLOTS,
  type InputGroupAddonVariantProps,
  type InputGroupButtonVariantProps,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
  inputGroupInputClassName,
  inputGroupRootClassName,
  inputGroupTextareaClassName,
  inputGroupTextClassName,
} from "./input-group.contract.js";

type InputGroupProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type InputGroupAddonProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div"> & InputGroupAddonVariantProps
>;
type InputGroupButtonProps = WithoutGovernedDataSlot<
  Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
    InputGroupButtonVariantProps & {
      type?: "button" | "submit" | "reset";
    }
>;
type InputGroupTextProps = WithoutGovernedDataSlot<
  React.ComponentProps<"span">
>;
type InputGroupInputProps = WithoutGovernedDataSlot<
  React.ComponentProps<"input">
>;
type InputGroupTextareaProps = WithoutGovernedDataSlot<
  React.ComponentProps<"textarea">
>;

function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      {...props}
      className={cn(inputGroupRootClassName, className)}
      data-slot={INPUT_GROUP_SLOTS.root}
      role="group"
    />
  );
}

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      {...props}
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot={INPUT_GROUP_SLOTS.addon}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) {
          return;
        }
        event.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      role="group"
    />
  );
}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      {...props}
      className={cn(inputGroupButtonVariants({ size }), className)}
      data-size={size}
      type={type}
      variant={variant}
    />
  );
}

function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return <span {...props} className={cn(inputGroupTextClassName, className)} />;
}

function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <Input {...props} className={cn(inputGroupInputClassName, className)} />
  );
}

function InputGroupTextarea({ className, ...props }: InputGroupTextareaProps) {
  return (
    <Textarea
      {...props}
      className={cn(inputGroupTextareaClassName, className)}
    />
  );
}

export type { InputGroupSlot } from "./input-group.contract.js";
export type {
  InputGroupAddonProps,
  InputGroupButtonProps,
  InputGroupInputProps,
  InputGroupProps,
  InputGroupTextareaProps,
  InputGroupTextProps,
};
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
