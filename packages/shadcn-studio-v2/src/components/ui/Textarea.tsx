// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends ComponentProps<"textarea"> {}

const TEXTAREA_BASE_CLASS =
  "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function textareaClassName({
  className,
}: Pick<TextareaProps, "className"> = {}): string {
  return cn(TEXTAREA_BASE_CLASS, className);
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={textareaClassName({ className })}
      data-slot="textarea"
    />
  );
}
