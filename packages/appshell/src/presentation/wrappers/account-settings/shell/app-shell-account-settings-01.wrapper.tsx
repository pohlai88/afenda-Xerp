"use client";

import { AppShellAccountSettings01 as GovernedAppShellAccountSettings01 } from "../../../blocks/app-shell-account-settings-01";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export type { AppShellAccountSettings01Props } from "../../../blocks/app-shell-account-settings-01";

export const AppShellAccountSettings01 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAppShellAccountSettings01,
});
