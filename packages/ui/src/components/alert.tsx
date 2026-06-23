import type {
  GovernedStatusProps,
  SlotRole,
  StatusTone,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const ALERT_RECIPE_NAME = "status" as const;

const ALERT_SLOT_ROLES = {
  title: "label",
  description: "body",
  action: "actions",
} as const satisfies Record<string, SlotRole>;

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
      recipeName: ALERT_RECIPE_NAME,
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
        {...applyGovernedPresentation(props, governed, {
          "data-density": density,
          "data-radius": radius,
          "data-tone": resolvedTone,
          role: resolvedRole,
        })}
      />
    );
  }
);

Alert.displayName = "Alert";

function createAlertSlot(
  displayName: string,
  slot: keyof typeof ALERT_SLOT_ROLES
) {
  const AlertSlot = React.forwardRef<HTMLDivElement, AlertSlotProps>(
    ({ className, ...props }, ref) => {
      const governed = resolvePrimitiveGovernance({
        componentName: "Alert",
        recipeName: ALERT_RECIPE_NAME,
        slot: ALERT_SLOT_ROLES[slot],
        className,
      });

      return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
    }
  );

  AlertSlot.displayName = displayName;

  return AlertSlot;
}

const AlertTitle = createAlertSlot("AlertTitle", "title");
const AlertDescription = createAlertSlot("AlertDescription", "description");
const AlertAction = createAlertSlot("AlertAction", "action");

export { Alert, AlertAction, AlertDescription, AlertTitle };
