import * as React from "react";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedStatusProps, StatusTone } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface AlertProps
  extends Omit<React.ComponentProps<"div">, "className">,
    GovernedStatusProps {
  readonly className?: string;
  readonly state?: string;
  /** @deprecated Use `tone="danger"` instead of `variant="destructive"`. */
  readonly variant?: "default" | "destructive";
}

function resolveAlertTone(
  tone: StatusTone | undefined,
  variant: AlertProps["variant"]
): StatusTone {
  if (tone !== undefined) {
    return tone;
  }

  if (variant === "destructive") {
    return "danger";
  }

  return "neutral";
}

function Alert({
  className,
  state,
  tone,
  variant,
  density = "standard",
  radius = "md",
  ...props
}: AlertProps) {
  const resolvedTone = resolveAlertTone(tone, variant);

  const governed = resolvePrimitiveGovernance({
    componentName: "Alert",
    recipeName: "status",
    variant: { tone: resolvedTone, density, radius },
    state,
    slot: "root",
    className,
  });

  return (
    <div
      {...governed.dataAttributes}
      role="alert"
      data-tone={resolvedTone}
      className={cn(governed.className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Alert",
    slot: "label",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Alert",
    slot: "body",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Alert",
    slot: "actions",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
