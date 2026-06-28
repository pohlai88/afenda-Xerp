"use client";

import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { AppShellPresentationStatisticsActivityCard } from "../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "./create-presentation-mcp-wrapper";

export type StatisticsActivityCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export const StatisticsActivityCard = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationStatisticsActivityCard,
});
