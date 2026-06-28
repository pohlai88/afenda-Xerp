"use client";

import { AppShellAccountSettings07PaymentMethod as GovernedPaymentMethod } from "../../../../blocks/account-settings-07/content/app-shell-account-settings-07-payment-method";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings07PaymentMethod =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedPaymentMethod,
  });
