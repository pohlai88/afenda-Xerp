import * as React from "react";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "className">,
    GovernedFormControlProps {
  readonly className?: string;
  readonly state?: string;
}

function Textarea({
  className,
  state,
  density = "standard",
  size = "md",
  ...props
}: TextareaProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Textarea",
    recipeName: "form-control",
    variant: {
      density,
      size,
    },
    state,
    slot: "root",
    className,
  });

  return (
    <textarea
      {...governed.dataAttributes}
      className={cn(governed.className)}
      {...props}
    />
  );
}

export { Textarea };
