"use client";

import { AppShellAccountSettings07AiGateway as GovernedAiGateway } from "../../../../blocks/account-settings-07/content/app-shell-account-settings-07-ai-gateway";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings07AiGateway = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAiGateway,
});
