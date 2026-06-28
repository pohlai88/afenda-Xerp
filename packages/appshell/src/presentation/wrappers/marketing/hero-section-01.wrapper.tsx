"use client";

import { AppShellPresentationHeroSection01 } from "../../../shadcn-studio-bridge/index.js";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export const HeroSection01 = createPresentationMcpWrapper({
  status: "delegating",
  BridgeComponent: AppShellPresentationHeroSection01,
});
