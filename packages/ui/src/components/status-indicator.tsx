import type {
  GovernedStatusIndicatorProps,
  StatusTone,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import type { SlotRole } from "@afenda/ui/governance/primitive-contract";
import * as React from "react";

const STATUS_INDICATOR_RECIPE_NAME = "status" as const;

const STATUS_INDICATOR_SLOT_ROLES = {
  root: "root",
  label: "label",
} as const satisfies Record<string, SlotRole>;

export interface StatusIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className">,
    GovernedStatusIndicatorProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

function resolveStatusIndicatorDotSlotKey(tone: StatusTone): string {
  return `dot-${tone}`;
}

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  (
    {
      className,
      children,
      state,
      tone = "neutral",
      density,
      radius,
      ...props
    },
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
      slot: STATUS_INDICATOR_SLOT_ROLES.root,
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
      slot: STATUS_INDICATOR_SLOT_ROLES.label,
    });

    return (
      <span
        ref={ref}
        {...applyGovernedPresentation(props, governed, { "data-tone": tone })}
      >
        <span aria-hidden="true" {...applyGovernedPresentation({}, dot)} />
        <span {...applyGovernedPresentation({}, label)}>{children}</span>
      </span>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };
