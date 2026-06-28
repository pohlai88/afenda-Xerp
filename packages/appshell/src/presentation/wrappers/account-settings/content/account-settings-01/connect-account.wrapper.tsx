"use client";

import { AppShellAccountSettings01ConnectAccount as GovernedConnectAccount } from "../../../../blocks/account-settings-01/content/app-shell-account-settings-01-connect-account";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings01ConnectAccount =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedConnectAccount,
  });
