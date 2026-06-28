"use client";

import { AppShellContextSwitcher as GovernedContextSwitcher } from "../../blocks/app-shell-context-switcher";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type {
  AppShellContextSwitcherGovernedComponents,
  AppShellContextSwitcherProps,
  AppShellContextSwitchSelection,
} from "../../blocks/app-shell-context-switcher";

export const AppShellContextSwitcher = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedContextSwitcher,
});
