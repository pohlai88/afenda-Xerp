// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type SidebarVariant = "default" | "rail";

export interface SidebarProps extends ComponentProps<"aside"> {
  readonly variant?: SidebarVariant;
}

const SIDEBAR_BASE_CLASS =
  "flex min-h-0 flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm";

const SIDEBAR_VARIANT_CLASSES = {
  default: "w-full p-4",
  rail: "w-full p-2 lg:w-16",
} satisfies Record<SidebarVariant, string>;

export function sidebarClassName({
  className,
  variant = "default",
}: Pick<SidebarProps, "className" | "variant"> = {}): string {
  return cn(SIDEBAR_BASE_CLASS, SIDEBAR_VARIANT_CLASSES[variant], className);
}

export function Sidebar({
  className,
  variant = "default",
  ...props
}: SidebarProps) {
  return (
    <aside
      {...props}
      className={sidebarClassName({ className, variant })}
      data-slot="sidebar"
    />
  );
}
