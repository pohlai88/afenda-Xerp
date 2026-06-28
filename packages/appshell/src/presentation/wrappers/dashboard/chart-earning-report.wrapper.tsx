"use client";

import { AppShellPresentationChartEarningReport } from "../../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export const ChartEarningReport = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationChartEarningReport,
});
