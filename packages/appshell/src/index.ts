// biome-ignore lint/performance/noBarrelFile: package public API entry point
export { AppShell } from "./app-shell";
export type {
  AppShellMainProps,
  AppShellNavItem,
  AppShellNavItemId,
  AppShellProps,
  AppShellWorkspaceContext,
} from "./app-shell.types";
export {
  DEFAULT_NAV_ITEMS,
  DEFAULT_WORKSPACE_CONTEXT,
} from "./app-shell.types";
export { AppShellCommandCenter } from "./app-shell-command-center";
export type { AppShellContextSwitcherProps } from "./app-shell-context-switcher";
export { AppShellContextSwitcher } from "./app-shell-context-switcher";
export type { AppShellHeaderProps } from "./app-shell-header";
export { AppShellHeader } from "./app-shell-header";
export { AppShellMain } from "./app-shell-main";
export type { AppShellSidebarProps } from "./app-shell-sidebar";
export { AppShellSidebar } from "./app-shell-sidebar";
