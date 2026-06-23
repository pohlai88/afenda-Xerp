import type { GovernedBadgeProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

const BADGE_RECIPE_NAME = "badge" as const;

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className">,
    GovernedBadgeProps {
  readonly asChild?: boolean;

  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      asChild = false,
      state,
      tone = "neutral",
      emphasis = "solid",
      density,
      size,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";

    const governed = resolvePrimitiveGovernance({
      componentName: "Badge",
      recipeName: BADGE_RECIPE_NAME,
      variant: {
        tone,
        emphasis,
        ...(density === undefined ? {} : { density }),
        ...(size === undefined ? {} : { size }),
      },
      state,
      slot: "root",
      className,
    });

    return (
      <Comp
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-emphasis": emphasis,
          "data-tone": tone,
          "data-density": density,
          "data-size": size,
        })}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
