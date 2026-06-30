import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { VariantProps } from "class-variance-authority";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import { badgeVariants } from "./badge.contract.js";

type BadgeProps = WithoutGovernedDataSlot<
  useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>
>;

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export type { BadgeSlot } from "./badge.contract.js";
export type { BadgeProps };
export { Badge, badgeVariants };
