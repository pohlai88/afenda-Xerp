"use client";

import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { AppShellPresentationStatisticsRevenueCard } from "../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "./create-presentation-mcp-wrapper";

export type StatisticsRevenueCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export const StatisticsRevenueCard = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationStatisticsRevenueCard,
});
