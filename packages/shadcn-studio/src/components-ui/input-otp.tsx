"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  INPUT_OTP_SLOTS,
  inputOtpSlotClassName,
} from "./input-otp.contract.js";

type InputOTPSlotProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div"> & {
    index: number;
  }
>;

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      data-slot="input-otp"
      spellCheck={false}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center rounded-md has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      {...props}
      className={cn(inputOtpSlotClassName, className)}
      data-active={isActive}
      data-slot={INPUT_OTP_SLOTS.slot}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      data-slot="input-otp-separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export type { InputOtpSlot } from "./input-otp.contract.js";
export type { InputOTPSlotProps };
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
