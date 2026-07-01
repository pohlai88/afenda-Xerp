import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  ALERT_SLOTS,
  type AlertVariantProps,
  alertActionClassName,
  alertDescriptionClassName,
  alertTitleClassName,
  alertVariants,
} from "./alert.contract.js";

type AlertProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div"> & AlertVariantProps
>;

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      {...props}
      className={cn(alertVariants({ variant }), className)}
      data-slot={ALERT_SLOTS.root}
      role="alert"
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(alertTitleClassName, className)}
      data-slot={ALERT_SLOTS.title}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(alertDescriptionClassName, className)}
      data-slot={ALERT_SLOTS.description}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(alertActionClassName, className)}
      data-slot={ALERT_SLOTS.action}
    />
  );
}

export type { AlertSlot } from "./alert.contract.js";
export type { AlertProps };
export { Alert, AlertAction, AlertDescription, AlertTitle };
