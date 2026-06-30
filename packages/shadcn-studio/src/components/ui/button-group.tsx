import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Separator } from "@/components/ui/separator";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  BUTTON_GROUP_SLOTS,
  buttonGroupVariants,
} from "./button-group.contract.js";

type ButtonGroupProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>
>;

function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      className={cn(buttonGroupVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot={BUTTON_GROUP_SLOTS.root}
      role="group"
    />
  );
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-md border bg-muted px-2.5 font-medium text-sm shadow-xs [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  });
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        "relative self-stretch bg-input data-horizontal:mx-px data-vertical:my-px data-vertical:h-auto data-horizontal:w-auto",
        className
      )}
      data-slot="button-group-separator"
      orientation={orientation}
      {...props}
    />
  );
}

export type { ButtonGroupSlot } from "./button-group.contract.js";
export type { ButtonGroupProps };
export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
