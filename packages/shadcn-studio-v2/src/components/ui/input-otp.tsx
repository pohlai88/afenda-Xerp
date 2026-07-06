"use client";

import { OTPField as OtpFieldPrimitive } from "@base-ui/react/otp-field";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface InputOtpProps
  extends Omit<ComponentProps<typeof OtpFieldPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}
export interface InputOtpGroupProps extends ComponentProps<"div"> {}
export interface InputOtpSlotProps
  extends Omit<ComponentProps<typeof OtpFieldPrimitive.Input>, "className"> {
  readonly className?: string | undefined;
}
export interface InputOtpSeparatorProps extends ComponentProps<"div"> {}

const INPUT_OTP_CLASS = "flex items-center gap-2";
const INPUT_OTP_SLOT_CLASS =
  "relative flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-center text-sm text-foreground shadow-xs transition-colors first:rounded-l-md last:rounded-r-md focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function inputOtpClassName({
  className,
}: Pick<InputOtpProps, "className"> = {}): string {
  return cn(INPUT_OTP_CLASS, className);
}

export function inputOtpSlotClassName({
  className,
}: Pick<InputOtpSlotProps, "className"> = {}): string {
  return cn(INPUT_OTP_SLOT_CLASS, className);
}

export function InputOtp({ className, ...props }: InputOtpProps) {
  return (
    <OtpFieldPrimitive.Root
      {...props}
      className={inputOtpClassName({ className })}
      data-slot="input-otp"
    />
  );
}

export function InputOtpGroup({ className, ...props }: InputOtpGroupProps) {
  return (
    <div
      {...props}
      className={cn("flex items-center", className)}
      data-slot="input-otp-group"
    />
  );
}

export function InputOtpSlot({ className, ...props }: InputOtpSlotProps) {
  return (
    <OtpFieldPrimitive.Input
      {...props}
      className={inputOtpSlotClassName({ className })}
      data-slot="input-otp-slot"
    />
  );
}

export function InputOtpSeparator({
  className,
  ...props
}: InputOtpSeparatorProps) {
  return (
    <div
      {...props}
      className={cn("text-muted-foreground", className)}
      data-slot="input-otp-separator"
    />
  );
}
