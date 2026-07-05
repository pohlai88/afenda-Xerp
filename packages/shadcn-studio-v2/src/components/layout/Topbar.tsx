// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type TopbarVariant = "default" | "transparent";

export interface TopbarProps extends ComponentProps<"header"> {
  readonly variant?: TopbarVariant;
}

const TOPBAR_BASE_CLASS =
  "flex min-h-14 items-center justify-between gap-3 rounded-lg border border-border px-4 py-3";

const TOPBAR_VARIANT_CLASSES = {
  default: "bg-card text-card-foreground shadow-sm",
  transparent: "border-transparent bg-transparent shadow-none",
} satisfies Record<TopbarVariant, string>;

export function topbarClassName({
  className,
  variant = "default",
}: Pick<TopbarProps, "className" | "variant"> = {}): string {
  return cn(TOPBAR_BASE_CLASS, TOPBAR_VARIANT_CLASSES[variant], className);
}

export function Topbar({
  className,
  variant = "default",
  ...props
}: TopbarProps) {
  return (
    <header
      {...props}
      className={topbarClassName({ className, variant })}
      data-slot="topbar"
    />
  );
}
