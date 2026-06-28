"use client";

import { AppShellPresentationStatisticsOrdersProgressCard } from "../../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export const StatisticsOrdersProgressCard = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationStatisticsOrdersProgressCard,
});
