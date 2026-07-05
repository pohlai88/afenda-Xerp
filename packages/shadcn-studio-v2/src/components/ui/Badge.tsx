// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends ComponentProps<"span"> {
  readonly variant?: BadgeVariant;
}

const BADGE_BASE_CLASS =
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const BADGE_VARIANT_CLASSES = {
  default: "border-transparent bg-primary text-primary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  outline: "text-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
} satisfies Record<BadgeVariant, string>;

export function badgeClassName({
  className,
  variant = "default",
}: Pick<BadgeProps, "className" | "variant"> = {}): string {
  return cn(BADGE_BASE_CLASS, BADGE_VARIANT_CLASSES[variant], className);
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={badgeClassName({ className, variant })}
      data-slot="badge"
    />
  );
}
