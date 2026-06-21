import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const KBD_RECIPE_NAME = "form-control" as const;

export interface KbdProps
  extends Omit<React.ComponentProps<"kbd">, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

export interface KbdGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Kbd",
      recipeName: KBD_RECIPE_NAME,
      state,
      slot: "root",
      className,
    });

    return <kbd ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

Kbd.displayName = "Kbd";

const KbdGroup = React.forwardRef<HTMLDivElement, KbdGroupProps>(
  ({ className, state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Kbd",
      recipeName: KBD_RECIPE_NAME,
      state,
      slotKey: "group",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

KbdGroup.displayName = "KbdGroup";

export { Kbd, KbdGroup };
