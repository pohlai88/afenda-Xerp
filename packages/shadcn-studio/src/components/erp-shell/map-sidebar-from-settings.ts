import type { Settings } from "../../theme/settings.contract.js";
import type { ThemeSidebarVariant } from "../../theme/theme-preset.contract.js";

export function mapSidebarVariant(
  variant: ThemeSidebarVariant
): "sidebar" | "floating" | "inset" {
  if (variant === "default") {
    return "sidebar";
  }

  return variant;
}

export function resolveSidebarProviderDefaultOpen(settings: Settings): boolean {
  return settings.sidebarOpen;
}
