"use client";

import { AppShellActivityFeed as GovernedActivityFeed } from "../../blocks/app-shell-activity-feed";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type {
  AppShellActivityFeedGovernedComponents,
  AppShellActivityFeedProps,
} from "../../blocks/app-shell-activity-feed";

export const AppShellActivityFeed = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedActivityFeed,
});
