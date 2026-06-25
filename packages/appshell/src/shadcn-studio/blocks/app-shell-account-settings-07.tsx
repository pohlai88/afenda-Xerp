"use client";

/**
 * Normalized account-settings-07 (billing & usage) — shadcn/studio Pro promotion.
 */

import { Alert, AlertDescription, AlertTitle, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { CircleAlertIcon } from "lucide-react";

import {
  AppShellAccountSettings07AddOns,
  type AppShellAccountSettings07AddOnsProps,
} from "./account-settings-07/content/app-shell-account-settings-07-add-ons";
import {
  AppShellAccountSettings07AiGateway,
  type AppShellAccountSettings07AiGatewayProps,
} from "./account-settings-07/content/app-shell-account-settings-07-ai-gateway";
import {
  AppShellAccountSettings07AllBilling,
  type AppShellAccountSettings07AllBillingProps,
} from "./account-settings-07/content/app-shell-account-settings-07-all-billing";
import {
  AppShellAccountSettings07PaymentMethod,
  type AppShellAccountSettings07PaymentMethodProps,
} from "./account-settings-07/content/app-shell-account-settings-07-payment-method";
import {
  AppShellAccountSettings07SpendManagement,
  type AppShellAccountSettings07SpendManagementProps,
} from "./account-settings-07/content/app-shell-account-settings-07-spend-management";

export interface AppShellAccountSettings07PlanAlert {
  readonly description: string;
  readonly title: string;
}

export interface AppShellAccountSettings07Props {
  readonly addOns?: AppShellAccountSettings07AddOnsProps;
  readonly aiGateway?: AppShellAccountSettings07AiGatewayProps;
  readonly allBilling?: AppShellAccountSettings07AllBillingProps;
  readonly paymentMethod?: AppShellAccountSettings07PaymentMethodProps;
  readonly planAlert?: AppShellAccountSettings07PlanAlert;
  readonly spendManagement?: AppShellAccountSettings07SpendManagementProps;
}

export type {
  AppShellAccountSettings07AddOnRow,
  AppShellAccountSettings07AddOnsProps,
} from "./account-settings-07/content/app-shell-account-settings-07-add-ons";
export type { AppShellAccountSettings07AiGatewayProps } from "./account-settings-07/content/app-shell-account-settings-07-ai-gateway";
export type {
  AppShellAccountSettings07AllBillingProps,
  AppShellAccountSettings07UsageRow,
} from "./account-settings-07/content/app-shell-account-settings-07-all-billing";
export type {
  AppShellAccountSettings07PaymentMethodProps,
  AppShellAccountSettings07PaymentMethodRow,
} from "./account-settings-07/content/app-shell-account-settings-07-payment-method";
export type { AppShellAccountSettings07SpendManagementProps } from "./account-settings-07/content/app-shell-account-settings-07-spend-management";

export function AppShellAccountSettings07({
  addOns,
  aiGateway,
  allBilling,
  paymentMethod,
  planAlert,
  spendManagement,
}: AppShellAccountSettings07Props) {
  return (
    <div className="app-shell-studio-account-settings-02">
      {planAlert ? (
        <div className="app-shell-studio-account-settings-07__plan-alert">
          <Alert tone="info">
            <CircleAlertIcon aria-hidden />
            <AlertTitle>{planAlert.title}</AlertTitle>
            <AlertDescription>{planAlert.description}</AlertDescription>
          </Alert>
        </div>
      ) : null}
      {allBilling ? (
        <AppShellAccountSettings07AllBilling {...allBilling} />
      ) : null}
      {spendManagement ? (
        <>
          <Separator />
          <AppShellAccountSettings07SpendManagement {...spendManagement} />
        </>
      ) : null}
      {paymentMethod ? (
        <>
          <Separator />
          <AppShellAccountSettings07PaymentMethod {...paymentMethod} />
        </>
      ) : null}
      {aiGateway ? (
        <>
          <Separator />
          <AppShellAccountSettings07AiGateway {...aiGateway} />
        </>
      ) : null}
      {addOns ? (
        <>
          <Separator />
          <AppShellAccountSettings07AddOns {...addOns} />
        </>
      ) : null}
    </div>
  );
}

export type AppShellAccountSettings07GovernedComponents = Extract<
  GovernedUiComponentName,
  "Alert" | "AlertDescription" | "AlertTitle" | "Separator"
>;
