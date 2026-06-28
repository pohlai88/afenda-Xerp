"use client";

import { AppShellAccountSettings06 as GovernedAppShellAccountSettings06 } from "../../../blocks/app-shell-account-settings-06";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export type { AppShellAccountSettings06Props } from "../../../blocks/app-shell-account-settings-06";

export const AppShellAccountSettings06 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAppShellAccountSettings06,
});
