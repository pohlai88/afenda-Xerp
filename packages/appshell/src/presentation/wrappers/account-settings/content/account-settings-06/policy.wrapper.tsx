"use client";

import { AppShellAccountSettings06Policy as GovernedPolicy } from "../../../../blocks/app-shell-account-settings-06-policy";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings06Policy = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedPolicy,
});
