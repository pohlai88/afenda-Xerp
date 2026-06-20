import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "@afenda/ui/lib/utils";
import {
  assertAllowedLayoutClassName,
  getComponentAccessibilityRequirement,
  resolveBadgeClassName,
} from "@afenda/ui/governance";
import type { AfendaBadgeProps } from "@afenda/ui/lib/afenda-contracts";

function Badge({
  className,
  tone = "neutral",
  emphasis = "solid",
  density = "standard",
  size = "sm",
  render,
  ...props
}: useRender.ComponentProps<"span"> & AfendaBadgeProps) {
  if (typeof className === "string") {
    assertAllowedLayoutClassName(className);
  }
  getComponentAccessibilityRequirement("Badge");

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          resolveBadgeClassName({ tone, emphasis, density, size }),
          className
        ),
        "data-slot": "badge",
        "data-tone": tone,
      } as React.HTMLAttributes<HTMLSpanElement>,
      props
    ),
    render,
    state: {
      slot: "badge",
      tone,
    },
  });
}

export { Badge };
