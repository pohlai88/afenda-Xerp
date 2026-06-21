import type { GovernedStatusProps, StatusTone } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import * as React from "react";

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedStatusProps {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;

  /**
   * @deprecated Use `tone="danger"` instead of `variant="destructive"`.
   * Migration bridge only — do not use in new code.
   */
  readonly variant?: "default" | "destructive";
}

interface AlertSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
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

function resolveAlertRole(
  tone: StatusTone,
  role: React.AriaRole | undefined
): React.AriaRole {
  if (role !== undefined) {
    return role;
  }

  return tone === "danger" || tone === "warning" ? "alert" : "status";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      state,
      tone,
      variant,
      density = "standard",
      radius = "md",
      role,
      ...props
    },
    ref
  ) => {
    const resolvedTone = resolveAlertTone(tone, variant);
    const resolvedRole = resolveAlertRole(resolvedTone, role);

    const governed = resolvePrimitiveGovernance({
      componentName: "Alert",
      recipeName: "status",
      variant: {
        tone: resolvedTone,
        density,
        radius,
      },
      state,
      slot: "root",
      className,
    });

    return (
      <div
        ref={ref}
        {...props}
        data-density={density}
        data-radius={radius}
        data-tone={resolvedTone}
        role={resolvedRole}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Alert.displayName = "Alert";

function createAlertSlot(
  displayName: string,
  slot: "label" | "body" | "actions"
) {
  const AlertSlot = React.forwardRef<HTMLDivElement, AlertSlotProps>(
    ({ className, ...props }, ref) => {
      const governed = resolvePrimitiveGovernance({
        componentName: "Alert",
        recipeName: "status",
        slot,
        className,
      });

      return (
        <div
          ref={ref}
          {...props}
          {...governed.dataAttributes}
          className={cn(governed.className)}
        />
      );
    }
  );

  AlertSlot.displayName = displayName;

  return AlertSlot;
}

const AlertTitle = createAlertSlot("AlertTitle", "label");
const AlertDescription = createAlertSlot("AlertDescription", "body");
const AlertAction = createAlertSlot("AlertAction", "actions");

export { Alert, AlertAction, AlertDescription, AlertTitle };
