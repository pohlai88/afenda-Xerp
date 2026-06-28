"use client";

import { AppShellAccountSettings04 as GovernedAppShellAccountSettings04 } from "../../../blocks/app-shell-account-settings-04";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export type { AppShellAccountSettings04Props } from "../../../blocks/app-shell-account-settings-04";

export const AppShellAccountSettings04 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAppShellAccountSettings04,
});
