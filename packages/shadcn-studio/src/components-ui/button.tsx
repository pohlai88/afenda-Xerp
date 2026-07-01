import { Button as ButtonPrimitive } from "@base-ui/react/button";

import type { WithoutGovernedDataSlot } from "../lib/governed-primitive-props.js";
import { cn } from "../utils/utils.js";

import {
  BUTTON_SLOTS,
  type ButtonVariantProps,
  buttonVariants,
} from "./button.contract.js";

type ButtonProps = WithoutGovernedDataSlot<
  ButtonPrimitive.Props & ButtonVariantProps
>;

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot={BUTTON_SLOTS.root}
    />
  );
}

export type { ButtonSlot } from "./button.contract.js";
export type { ButtonProps, ButtonVariantProps };
export { Button, buttonVariants };
