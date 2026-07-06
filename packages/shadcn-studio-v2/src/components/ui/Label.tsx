import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface LabelProps extends ComponentProps<"label"> {}

const LABEL_BASE_CLASS =
  "font-medium text-sm leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

export function labelClassName({
  className,
}: Pick<LabelProps, "className"> = {}): string {
  return cn(LABEL_BASE_CLASS, className);
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={labelClassName({ className })}
      data-slot="label"
    />
  );
}
