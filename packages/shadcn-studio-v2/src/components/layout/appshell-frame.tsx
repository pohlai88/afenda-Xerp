import { cn } from "../../lib/cn";
import type {
  AppShellFrameClassNameOptions,
  AppShellFrameDensityClassMap,
  AppShellFrameProps,
  AppShellFrameStructureClassMap,
} from "../../types/layout";
import { APP_SHELL_FRAME_SLOTS } from "../../types/layout";

const APP_SHELL_BASE_CLASS =
  "min-h-svh bg-background text-foreground antialiased";

const APP_SHELL_DENSITY_CLASSES = {
  comfortable: "gap-6 p-6",
  compact: "gap-4 p-4",
} satisfies AppShellFrameDensityClassMap;

const APP_SHELL_STRUCTURE_CLASSES = {
  sidebar: "grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)]",
  single: "flex flex-col",
} satisfies AppShellFrameStructureClassMap;

export function appShellFrameClassName({
  className,
  density = "comfortable",
  structure = "sidebar",
}: AppShellFrameClassNameOptions = {}): string {
  return cn(
    APP_SHELL_BASE_CLASS,
    APP_SHELL_STRUCTURE_CLASSES[structure],
    APP_SHELL_DENSITY_CLASSES[density],
    className
  );
}

export function AppShellFrame({
  className,
  density = "comfortable",
  structure = "sidebar",
  ...props
}: AppShellFrameProps) {
  return (
    <div
      {...props}
      className={appShellFrameClassName({ className, density, structure })}
      data-slot={APP_SHELL_FRAME_SLOTS.root}
    />
  );
}
