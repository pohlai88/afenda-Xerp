// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface LabelProps extends ComponentProps<"label"> {}

const LABEL_BASE_CLASS =
  "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

export function labelClassName({
  className,
}: Pick<LabelProps, "className"> = {}): string {
  return cn(LABEL_BASE_CLASS, className);
}

export function Label({ className, ...props }: LabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Primitive forwards htmlFor/children via spread props at call sites.
    <label
      {...props}
      className={labelClassName({ className })}
      data-slot="label"
    />
  );
}
