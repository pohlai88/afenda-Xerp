"use client";

import { AppShellDashboardOverflowMenu as GovernedOverflowMenu } from "../../blocks/app-shell-dashboard-overflow-menu";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type {
  AppShellDashboardOverflowMenuGovernedComponents,
  AppShellDashboardOverflowMenuProps,
} from "../../blocks/app-shell-dashboard-overflow-menu";

export const AppShellDashboardOverflowMenu = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedOverflowMenu,
});
