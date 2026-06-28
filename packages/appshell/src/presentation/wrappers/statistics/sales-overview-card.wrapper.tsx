"use client";

import { AppShellPresentationStatisticsSalesOverviewCard } from "../../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export const StatisticsSalesOverviewCard = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationStatisticsSalesOverviewCard,
});
