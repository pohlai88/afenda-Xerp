import type {
  GovernedNativeSelectProps,
  SlotRole,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

const NATIVE_SELECT_RECIPE_NAME = "form-control" as const;

const NATIVE_SELECT_SLOT_ROLES = {
  root: "root",
  control: "control",
  state: "state",
} as const satisfies Record<"root" | "control" | "state", SlotRole>;

export type NativeSelectSize = "sm" | "default";

export interface NativeSelectProps
  extends Omit<React.ComponentPropsWithoutRef<"select">, "size">,
    GovernedNativeSelectProps {
  readonly size?: NativeSelectSize;
  readonly className?: string;
}

const NativeSelect = React.forwardRef<HTMLDivElement, NativeSelectProps>(
  ({ className, size = "default", state, ...props }, ref) => {
    const wrapper = resolvePrimitiveGovernance({
      componentName: "NativeSelect",
      recipeName: NATIVE_SELECT_RECIPE_NAME,
      slot: NATIVE_SELECT_SLOT_ROLES.root,
      state,
      className,
    });

    const control = resolvePrimitiveGovernance({
      componentName: "NativeSelect",
      recipeName: NATIVE_SELECT_RECIPE_NAME,
      slot: NATIVE_SELECT_SLOT_ROLES.control,
      state,
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
          aria-hidden="true"
          {...applyGovernedPresentation({}, icon)}
        />
      </div>
    );
  }
);

NativeSelect.displayName = "NativeSelect";

export interface NativeSelectOptionProps
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
    slot: NATIVE_SELECT_SLOT_ROLES.state,
    className,
  });

  return <option ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

NativeSelectOption.displayName = "NativeSelectOption";

export interface NativeSelectOptGroupProps
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
