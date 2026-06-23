import type { GovernedButtonGroupProps, SlotRole } from "@afenda/ui/governance";
import {
  applyGovernedPresentation,
  mergeGovernedPresentation,
} from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Separator as SeparatorPrimitive, Slot } from "radix-ui";
import * as React from "react";

const BUTTON_GROUP_RECIPE_NAME = "surface" as const;
const SEPARATOR_RECIPE_NAME = "form-control" as const;

const BUTTON_GROUP_SLOT_ROLES = {
  root: "root",
  control: "control",
  footer: "footer",
} as const satisfies Record<string, SlotRole>;

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className">,
    GovernedButtonGroupProps {
  readonly className?: string;
  readonly orientation?: ButtonGroupOrientation;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "ButtonGroup",
      recipeName: BUTTON_GROUP_RECIPE_NAME,
      state,
      slot: BUTTON_GROUP_SLOT_ROLES.root,
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
      slot: BUTTON_GROUP_SLOT_ROLES.control,
      className,
    });

    const Comp = asChild ? Slot.Root : "div";

    return <Comp ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ButtonGroupText.displayName = "ButtonGroupText";

const ButtonGroupSeparator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    readonly className?: string;
  }
>(
  (
    { className, orientation = "vertical", decorative = true, ...props },
    ref
  ) => {
    const groupGoverned = resolvePrimitiveGovernance({
      componentName: "ButtonGroup",
      recipeName: BUTTON_GROUP_RECIPE_NAME,
      slot: BUTTON_GROUP_SLOT_ROLES.footer,
      className,
    });

    const separatorGoverned = resolvePrimitiveGovernance({
      componentName: "Separator",
      recipeName: SEPARATOR_RECIPE_NAME,
      slot: "root",
    });

    const merged = mergeGovernedPresentation(separatorGoverned, groupGoverned);

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        {...applyGovernedPresentation(
          { ...props, decorative, orientation },
          merged
        )}
      />
    );
  }
);

ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
