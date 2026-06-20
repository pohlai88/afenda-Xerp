import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { ButtonState } from "@base-ui/react/button";

import { cn } from "@afenda/ui/lib/utils";
import {
  assertAllowedLayoutClassName,
  getComponentAccessibilityRequirement,
  resolveButtonClassName,
} from "@afenda/ui/governance";
import type { AfendaButtonProps } from "@afenda/ui/lib/afenda-contracts";

type ButtonPrimitiveProps = ButtonPrimitive.Props;

function Button({
  className,
  intent = "primary",
  emphasis = "solid",
  size = "md",
  density,
  presentation = "default",
  ...props
}: ButtonPrimitiveProps & AfendaButtonProps) {
  if (typeof className === "string") {
    assertAllowedLayoutClassName(className);
  }
  getComponentAccessibilityRequirement("Button");

  const recipeSelection = {
    intent,
    emphasis,
    size,
    presentation,
    ...(density === undefined ? {} : { density }),
  };
  const recipeClasses = resolveButtonClassName(recipeSelection);
  const mergedClassName =
    typeof className === "function"
      ? (state: ButtonState) => cn(recipeClasses, className(state))
      : cn(recipeClasses, className);

  return (
    <ButtonPrimitive
      data-slot="button"
      {...(density === undefined ? {} : { "data-density": density })}
      className={mergedClassName}
      {...props}
    />
  );
}

export { Button };
