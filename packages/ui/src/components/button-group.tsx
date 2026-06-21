import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Slot } from "radix-ui";
import * as React from "react";
import { Separator } from "./separator";

const BUTTON_GROUP_RECIPE_NAME = "surface" as const;

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly className?: string;
  readonly orientation?: ButtonGroupOrientation;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "ButtonGroup",
      recipeName: BUTTON_GROUP_RECIPE_NAME,
      slot: "root",
      slotKey: `orientation-${orientation}`,
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation({ ...props, role: "group" }, governed, {
          "data-orientation": orientation,
        })}
      />
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

interface ButtonGroupTextProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly asChild?: boolean;
  readonly className?: string;
}

const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "ButtonGroup",
      recipeName: BUTTON_GROUP_RECIPE_NAME,
      slot: "control",
      className,
    });

    const Comp = asChild ? Slot.Root : "div";

    return <Comp ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ButtonGroupText.displayName = "ButtonGroupText";

const ButtonGroupSeparator = React.forwardRef<
  React.ComponentRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator> & {
    readonly className?: string;
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ButtonGroup",
    recipeName: BUTTON_GROUP_RECIPE_NAME,
    slot: "footer",
    className,
  });

  return (
    <Separator
      ref={ref}
      {...applyGovernedPresentation({ ...props, orientation }, governed)}
    />
  );
});

ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
