import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedButtonProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "className">,
    GovernedButtonProps {
  readonly asChild?: boolean;
  readonly className?: string;
  readonly state?: string;
}

function Button({
  asChild = false,
  className,
  state,
  intent = "primary",
  emphasis = "solid",
  size = "md",
  density,
  presentation = "default",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  const governed = resolvePrimitiveGovernance({
    componentName: "Button",
    recipeName: "button",
    variant: {
      intent,
      emphasis,
      size,
      ...(density === undefined ? {} : { density }),
    },
    presentation,
    state,
    slot: "root",
    className,
  });

  return (
    <Comp
      {...governed.dataAttributes}
      {...(density === undefined ? {} : { "data-density": density })}
      data-intent={intent}
      data-emphasis={emphasis}
      data-size={size}
      data-presentation={presentation}
      className={cn(governed.className)}
      {...props}
    />
  );
}

export { Button };
