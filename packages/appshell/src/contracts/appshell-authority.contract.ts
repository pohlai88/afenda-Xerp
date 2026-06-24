/**
 * ADR-0001 AppShell authority — chrome regions, layout slots, and governed primitive ownership.
 * Serializable contract surface only (no React runtime types).
 */

export const APPSHELL_CHROME_REGIONS = [
  "sidebar",
  "header",
  "main",
  "footer",
] as const;

export type AppShellChromeRegion = (typeof APPSHELL_CHROME_REGIONS)[number];

export const APPSHELL_SIDEBAR_SLOTS = [
  "brand",
  "primary-navigation",
  "team-recipients",
  "user-profile",
] as const;

export type AppShellSidebarSlot = (typeof APPSHELL_SIDEBAR_SLOTS)[number];

export const APPSHELL_MAIN_SLOTS = [
  "page-title",
  "page-actions",
  "page-content",
] as const;

export type AppShellMainSlot = (typeof APPSHELL_MAIN_SLOTS)[number];

/** Governed `@afenda/ui` primitives owned by ApplicationShell root composition. */
export type ApplicationShellRootGovernedComponentName =
  | "Avatar"
  | "Badge"
  | "Button"
  | "Collapsible"
  | "Sidebar";

export const APPLICATION_SHELL_ROOT_GOVERNED_COMPONENT_NAMES = [
  "Avatar",
  "Badge",
  "Button",
  "Collapsible",
  "Sidebar",
] as const satisfies readonly ApplicationShellRootGovernedComponentName[];

/** Governed primitives for AppShellMain page chrome. */
export type AppShellMainGovernedComponentName = "Badge" | "Button";

export const APPSHELL_MAIN_GOVERNED_COMPONENT_NAMES = [
  "Badge",
  "Button",
] as const satisfies readonly AppShellMainGovernedComponentName[];

export function isAppShellChromeRegion(
  value: string
): value is AppShellChromeRegion {
  return (APPSHELL_CHROME_REGIONS as readonly string[]).includes(value);
}
