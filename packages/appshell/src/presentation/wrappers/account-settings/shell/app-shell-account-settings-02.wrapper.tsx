"use client";

import { AppShellAccountSettings02 as GovernedAppShellAccountSettings02 } from "../../../blocks/app-shell-account-settings-02";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export type { AppShellAccountSettings02Props } from "../../../blocks/app-shell-account-settings-02";

export const AppShellAccountSettings02 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAppShellAccountSettings02,
});
