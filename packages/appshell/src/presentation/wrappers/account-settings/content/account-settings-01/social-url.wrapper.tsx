"use client";

import { AppShellAccountSettings01SocialUrl as GovernedSocialUrl } from "../../../../blocks/account-settings-01/content/app-shell-account-settings-01-social-url";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings01SocialUrl = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedSocialUrl,
});
