// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends ComponentProps<"input"> {}

const INPUT_BASE_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function inputClassName({
  className,
}: Pick<InputProps, "className"> = {}): string {
  return cn(INPUT_BASE_CLASS, className);
}

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={inputClassName({ className })}
      data-slot="input"
      type={type}
    />
  );
}
