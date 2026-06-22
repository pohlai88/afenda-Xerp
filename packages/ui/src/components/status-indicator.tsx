import type { GovernedStatusProps, StatusTone } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import * as React from "react";

const STATUS_INDICATOR_RECIPE_NAME = "status" as const;

export interface StatusIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className">,
    GovernedStatusProps {
  readonly children: React.ReactNode;

  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

function resolveStatusIndicatorDotSlotKey(tone: StatusTone): string {
  return `dot-${tone}`;
}

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  (
    { className, children, state, tone = "neutral", density, radius, ...props },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "StatusIndicator",
      recipeName: STATUS_INDICATOR_RECIPE_NAME,
      variant: {
        tone,
        ...(density === undefined ? {} : { density }),
        ...(radius === undefined ? {} : { radius }),
      },
      state,
      slot: "root",
      className,
    });

    const dot = resolvePrimitiveGovernance({
      componentName: "StatusIndicator",
      recipeName: STATUS_INDICATOR_RECIPE_NAME,
      slotKey: resolveStatusIndicatorDotSlotKey(tone),
    });

    const label = resolvePrimitiveGovernance({
      componentName: "StatusIndicator",
      recipeName: STATUS_INDICATOR_RECIPE_NAME,
      slot: "label",
    });

    return (
      <span
        ref={ref}
        {...props}
        data-tone={tone}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      >
        <span aria-hidden="true" {...applyGovernedPresentation({}, dot)} />
        <span {...applyGovernedPresentation({}, label)}>{children}</span>
      </span>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };
