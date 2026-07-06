// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { OtpField as OtpFieldPrimitive } from "@base-ui/react/otp-field";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface InputOtpProps
  extends ComponentProps<typeof OtpFieldPrimitive.Root> {}
export interface InputOtpGroupProps extends ComponentProps<"div"> {}
export interface InputOtpSlotProps
  extends ComponentProps<typeof OtpFieldPrimitive.Input> {}
export interface InputOtpSeparatorProps extends ComponentProps<"div"> {}

export function InputOtp({ className, ...props }: InputOtpProps) {
  return (
    <OtpFieldPrimitive.Root
      {...props}
      className={cn(
        "flex items-center gap-2",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border border-input text-center text-sm shadow-xs transition-all first:rounded-l-md last:rounded-r-md focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        typeof className === "string" ? className : undefined
      )}
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
