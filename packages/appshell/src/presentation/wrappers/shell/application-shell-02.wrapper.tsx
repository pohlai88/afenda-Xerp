"use client";

import { AppShellApplicationShell02SystemAdminChrome as GovernedApplicationShell02 } from "../../blocks/app-shell-application-shell-02";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type {
  AppShellApplicationShell02GovernedComponents,
  AppShellApplicationShell02Section,
  AppShellApplicationShell02SystemAdminChromeProps,
  AppShellApplicationShell02UserProfile,
} from "../../blocks/app-shell-application-shell-02";

export const AppShellApplicationShell02SystemAdminChrome =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedApplicationShell02,
  });
