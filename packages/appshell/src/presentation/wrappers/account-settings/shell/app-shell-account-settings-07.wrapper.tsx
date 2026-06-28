"use client";

import { AppShellAccountSettings07 as GovernedAppShellAccountSettings07 } from "../../../blocks/app-shell-account-settings-07";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export type { AppShellAccountSettings07Props } from "../../../blocks/app-shell-account-settings-07";

export const AppShellAccountSettings07 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAppShellAccountSettings07,
});
