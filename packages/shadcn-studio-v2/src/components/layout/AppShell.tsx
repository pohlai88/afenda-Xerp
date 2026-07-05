// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type AppShellDensity = "comfortable" | "compact";

export interface AppShellProps extends ComponentProps<"div"> {
  readonly density?: AppShellDensity;
}

const APP_SHELL_BASE_CLASS =
  "min-h-svh bg-background text-foreground antialiased";

const APP_SHELL_DENSITY_CLASSES = {
  comfortable: "gap-6 p-6",
  compact: "gap-4 p-4",
} satisfies Record<AppShellDensity, string>;

export function appShellClassName({
  className,
  density = "comfortable",
}: Pick<AppShellProps, "className" | "density"> = {}): string {
  return cn(
    APP_SHELL_BASE_CLASS,
    "grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)]",
    APP_SHELL_DENSITY_CLASSES[density],
    className
  );
}

export function AppShell({
  className,
  density = "comfortable",
  ...props
}: AppShellProps) {
  return (
    <div
      {...props}
      className={appShellClassName({ className, density })}
      data-slot="app-shell"
    />
  );
}
