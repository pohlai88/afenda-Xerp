"use client";

import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { AppShellPresentationStatisticsProfileTrafficCard } from "../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "./create-presentation-mcp-wrapper";

export type StatisticsProfileTrafficCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export const StatisticsProfileTrafficCard = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationStatisticsProfileTrafficCard,
});
