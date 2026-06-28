"use client";

import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { AppShellPresentationStatisticsLeadsCard } from "../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "./create-presentation-mcp-wrapper";

export type StatisticsLeadsCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export const StatisticsLeadsCard = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationStatisticsLeadsCard,
});
