import type { GovernedButtonProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

import { cn } from "@afenda/ui/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">,
    GovernedButtonProps {
  readonly asChild?: boolean;

  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      state,
      intent = "primary",
      emphasis = "solid",
      size = "md",
      density,
      presentation = "default",
      type,
      disabled,
      tabIndex,
      "aria-disabled": ariaDisabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

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

    const resolvedType = asChild ? undefined : (type ?? "button");

    const resolvedAriaDisabled = asChild && disabled ? true : ariaDisabled;

    const resolvedTabIndex =
      asChild && disabled && tabIndex === undefined ? -1 : tabIndex;

    return (
      <Comp
        ref={ref}
        {...props}
        aria-disabled={resolvedAriaDisabled}
        data-emphasis={emphasis}
        data-intent={intent}
        data-presentation={presentation}
        data-size={size}
        disabled={asChild ? undefined : disabled}
        tabIndex={resolvedTabIndex}
        type={resolvedType}
        {...(density === undefined ? {} : { "data-density": density })}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
