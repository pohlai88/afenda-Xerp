import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "#/lib/utils";
import type { GovernedBadgeProps } from "@/governance";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

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
      recipeName: "badge",
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
        {...props}
        data-tone={tone}
        data-emphasis={emphasis}
        {...(density === undefined ? {} : { "data-density": density })}
        {...(size === undefined ? {} : { "data-size": size })}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
