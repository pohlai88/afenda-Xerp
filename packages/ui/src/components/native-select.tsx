import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

import { cn } from "@afenda/ui/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

const NATIVE_SELECT_RECIPE_NAME = "form-control" as const;

type NativeSelectProps = Omit<
  React.ComponentPropsWithoutRef<"select">,
  "size"
> & {
  readonly size?: "sm" | "default";
  readonly className?: string;
};

const NativeSelect = React.forwardRef<HTMLDivElement, NativeSelectProps>(
  ({ className, size = "default", ...props }, ref) => {
    const wrapper = resolvePrimitiveGovernance({
      componentName: "NativeSelect",
      recipeName: NATIVE_SELECT_RECIPE_NAME,
      slot: "root",
      className,
    });

    const control = resolvePrimitiveGovernance({
      componentName: "NativeSelect",
      recipeName: NATIVE_SELECT_RECIPE_NAME,
      slot: "control",
    });

    const icon = resolvePrimitiveGovernance({
      componentName: "NativeSelect",
      recipeName: NATIVE_SELECT_RECIPE_NAME,
      slotKey: "icon",
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation({}, wrapper, { "data-size": size })}
      >
        <select
          {...applyGovernedPresentation(props, control, { "data-size": size })}
        />
        <ChevronDownIcon
          {...icon.dataAttributes}
          aria-hidden="true"
          className={cn(icon.className)}
        />
      </div>
    );
  }
);

NativeSelect.displayName = "NativeSelect";

interface NativeSelectOptionProps
  extends Omit<React.ComponentPropsWithoutRef<"option">, "className"> {
  readonly className?: string;
}

const NativeSelectOption = React.forwardRef<
  HTMLOptionElement,
  NativeSelectOptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NativeSelect",
    recipeName: NATIVE_SELECT_RECIPE_NAME,
    slot: "state",
    className,
  });

  return <option ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

NativeSelectOption.displayName = "NativeSelectOption";

interface NativeSelectOptGroupProps
  extends Omit<React.ComponentPropsWithoutRef<"optgroup">, "className"> {
  readonly className?: string;
}

const NativeSelectOptGroup = React.forwardRef<
  HTMLOptGroupElement,
  NativeSelectOptGroupProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NativeSelect",
    recipeName: NATIVE_SELECT_RECIPE_NAME,
    slotKey: "optgroup",
    className,
  });

  return <optgroup ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

NativeSelectOptGroup.displayName = "NativeSelectOptGroup";

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
