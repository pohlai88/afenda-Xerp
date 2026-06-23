import type { GovernedButtonProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

const BUTTON_RECIPE_NAME = "button" as const;

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
      "aria-busy": ariaBusy,
      "aria-disabled": ariaDisabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const governed = resolvePrimitiveGovernance({
      componentName: "Button",
      recipeName: BUTTON_RECIPE_NAME,
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
    const resolvedAriaBusy =
      ariaBusy !== undefined ? ariaBusy : state === "loading" ? true : undefined;

    return (
      <Comp
        ref={ref}
        {...applyGovernedPresentation(
          {
            ...props,
            type: resolvedType,
            disabled: asChild ? undefined : disabled,
            "aria-busy": resolvedAriaBusy,
            "aria-disabled": resolvedAriaDisabled,
            tabIndex: resolvedTabIndex,
          },
          governed,
          {
            "data-density": density,
            "data-emphasis": emphasis,
            "data-intent": intent,
            "data-presentation": presentation,
            "data-size": size,
          }
        )}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
