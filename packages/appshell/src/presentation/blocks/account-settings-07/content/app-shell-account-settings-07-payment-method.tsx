"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { EllipsisVerticalIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings07PaymentMethodRow {
  readonly brandImageUrl?: string;
  readonly expiryLabel: string;
  readonly id: string;
  readonly label: string;
}

export interface AppShellAccountSettings07PaymentMethodProps {
  readonly addPaymentSlot?: ReactNode;
  readonly methods: readonly AppShellAccountSettings07PaymentMethodRow[];
  readonly onMakeDefault?: (methodId: string) => void;
  readonly onRemove?: (methodId: string) => void;
  readonly pending?: boolean;
}

export function AppShellAccountSettings07PaymentMethod({
  addPaymentSlot,
  methods,
  onMakeDefault,
  onRemove,
  pending = false,
}: AppShellAccountSettings07PaymentMethodProps) {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage your payment method and billing information."
      title="Payment method"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-07__payment-list">
        {methods.map((method, index) => (
          <div key={method.id}>
            <div className="app-shell-studio-account-settings-07__payment-row">
              <div className="app-shell-studio-account-settings-07__payment-brand">
                {method.brandImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- consumer brand asset
                  <img alt="" src={method.brandImageUrl} />
                ) : null}
                <p className="app-shell-studio-account-settings-02__item-title">
                  {method.label}
                </p>
              </div>
              <div className="app-shell-studio-account-settings-05__actions">
                <p className="app-shell-studio-account-settings-06__description">
                  {method.expiryLabel}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label={`Payment method actions for ${method.label}`}
                      disabled={pending}
                      emphasis="ghost"
                      intent="secondary"
                      presentation="icon"
                      size="sm"
                      type="button"
                    >
                      <EllipsisVerticalIcon aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      {onMakeDefault ? (
                        <DropdownMenuItem
                          onSelect={() => onMakeDefault(method.id)}
                        >
                          Make default
                        </DropdownMenuItem>
                      ) : null}
                      {onRemove ? (
                        <DropdownMenuItem onSelect={() => onRemove(method.id)}>
                          Remove
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {index < methods.length - 1 ? <Separator /> : null}
          </div>
        ))}
      </div>
      {addPaymentSlot}
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings07PaymentMethodGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "DropdownMenu"
  | "DropdownMenuContent"
  | "DropdownMenuGroup"
  | "DropdownMenuItem"
  | "DropdownMenuTrigger"
  | "Separator"
>;
