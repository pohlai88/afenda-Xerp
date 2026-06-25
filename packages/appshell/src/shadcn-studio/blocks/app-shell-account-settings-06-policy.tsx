"use client";

/**
 * Tenant MFA policy slice of account-settings-06 — ARCH-USER-001 Slice 6 / ARCH-ADMIN-001.
 * Admin Security tab only; personal MFA + sessions live on `/settings/security`.
 */

import { Badge, Card, Label, Switch } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

export type AppShellAccountSettings06PolicyGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Card" | "Label" | "Switch"
>;

export interface AppShellAccountSettings06PolicyProps {
  readonly mfaPolicyPending?: boolean;
  readonly mfaPolicyRequired: boolean;
  readonly onMfaPolicyChange: (required: boolean) => void;
}

export function AppShellAccountSettings06Policy({
  mfaPolicyPending = false,
  mfaPolicyRequired,
  onMfaPolicyChange,
}: AppShellAccountSettings06PolicyProps) {
  const tenantMfaPolicySectionId = useId();
  const tenantMfaPolicySwitchId = useId();

  return (
    <div className="app-shell-studio-account-settings-06">
      <section
        aria-labelledby={tenantMfaPolicySectionId}
        className="app-shell-studio-account-settings-06__section"
      >
        <div className="app-shell-studio-account-settings-06__row">
          <div className="app-shell-studio-account-settings-06__aside">
            <h3
              className="app-shell-studio-account-settings-06__title"
              id={tenantMfaPolicySectionId}
            >
              Tenant MFA policy
            </h3>
            <p className="app-shell-studio-account-settings-06__description">
              Require two-factor authentication for all members in this tenant.
            </p>
          </div>
          <div className="app-shell-studio-account-settings-06__content">
            <Card>
              <div className="app-shell-studio-account-settings-06__panel">
                <div className="app-shell-studio-account-settings-06__policy-row">
                  <div className="app-shell-studio-account-settings-06__policy-copy">
                    <Label htmlFor={tenantMfaPolicySwitchId}>
                      Enforce MFA for workspace access
                    </Label>
                    <p className="app-shell-studio-account-settings-06__description">
                      When enabled, members without MFA cannot access protected
                      ERP surfaces.
                    </p>
                  </div>
                  <Switch
                    aria-busy={mfaPolicyPending}
                    checked={mfaPolicyRequired}
                    disabled={mfaPolicyPending}
                    id={tenantMfaPolicySwitchId}
                    onCheckedChange={onMfaPolicyChange}
                    size="md"
                  />
                </div>
                <Badge
                  emphasis="soft"
                  tone={mfaPolicyRequired ? "success" : "info"}
                >
                  {mfaPolicyRequired ? "Enforcement active" : "Optional MFA"}
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
