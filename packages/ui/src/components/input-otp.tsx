"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";

const INPUT_OTP_RECIPE_NAME = "form-control" as const;

/**
 * We omit both "className" (managed by governance) and "render" (we only
 * support the children-based branch of OTPInput's discriminated union).
 * Keeping "render" in the type collapses the union under exactOptionalPropertyTypes,
 * producing `render: InputOTPRenderFn` which conflicts with the `render?: never`
 * branch when the spread is checked.  Omitting it means the spread never carries
 * the property, satisfying `render?: never` for the children variant.
 */
interface InputOTPProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof OTPInput>,
    "className" | "render"
  > {
  readonly className?: string;
  readonly containerClassName?: string;
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ className, containerClassName, ...props }, ref) => {
    const root = resolvePrimitiveGovernance({
      componentName: "InputOTP",
      recipeName: INPUT_OTP_RECIPE_NAME,
      slot: "root",
      className,
    });

    const container = resolvePrimitiveGovernance({
      componentName: "InputOTP",
      recipeName: INPUT_OTP_RECIPE_NAME,
      slot: "body",
      className: containerClassName,
    });

    return (
      <OTPInput
        ref={ref}
        spellCheck={false}
        {...props}
        {...root.dataAttributes}
        className={cn(root.className)}
        containerClassName={cn(container.className)}
      />
    );
  }
);

InputOTP.displayName = "InputOTP";

interface InputOTPGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const InputOTPGroup = React.forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "InputOTP",
      recipeName: INPUT_OTP_RECIPE_NAME,
      slotKey: "group-shell",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

InputOTPGroup.displayName = "InputOTPGroup";

interface InputOTPSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
  readonly index: number;
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } =
      inputOTPContext?.slots[index] ?? {};

    const governed = resolvePrimitiveGovernance({
      componentName: "InputOTP",
      recipeName: INPUT_OTP_RECIPE_NAME,
      slot: "control",
      className,
    });

    const caretWrap = resolvePrimitiveGovernance({
      componentName: "InputOTP",
      recipeName: INPUT_OTP_RECIPE_NAME,
      slotKey: "caret-blink",
    });

    const caretLine = resolvePrimitiveGovernance({
      componentName: "InputOTP",
      recipeName: INPUT_OTP_RECIPE_NAME,
      slotKey: "caret-line",
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-active": isActive,
        })}
      >
        {char}
        {hasFakeCaret ? (
          <div
            {...caretWrap.dataAttributes}
            className={cn(caretWrap.className)}
          >
            <div
              {...caretLine.dataAttributes}
              className={cn(caretLine.className)}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

InputOTPSlot.displayName = "InputOTPSlot";

interface InputOTPSeparatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  InputOTPSeparatorProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "InputOTP",
    recipeName: INPUT_OTP_RECIPE_NAME,
    slot: "icon",
    className,
  });

  return (
    <div
      ref={ref}
      {...applyGovernedPresentation({ ...props, role: "separator" }, governed)}
    >
      <MinusIcon />
    </div>
  );
});

InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
