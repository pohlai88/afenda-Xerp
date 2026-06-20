import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedBadgeProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface BadgeProps
  extends Omit<React.ComponentProps<"span">, "className">,
    GovernedBadgeProps {
  readonly asChild?: boolean;
  readonly className?: string;
  readonly state?: string;
}

function Badge({
  className,
  asChild = false,
  state,
  tone = "neutral",
  emphasis = "solid",
  density,
  size,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

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
      {...governed.dataAttributes}
      data-tone={tone}
      data-emphasis={emphasis}
      className={cn(governed.className)}
      {...props}
    />
  );
}

export { Badge };
