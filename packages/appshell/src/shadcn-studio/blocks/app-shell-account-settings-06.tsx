"use client";

/**
 * Normalized account-settings-06 (security) — ARCH-AUTH-001 Slice 5.
 * Source: @ss-blocks/account-settings-06 staged in packages/ui.
 *
 * Q1 — Tailwind layout replaced by `.app-shell-studio-account-settings-06__*`
 * Q2 — @afenda/ui primitives use governed props only (zero className on primitives)
 * Q3 — Data + mutations injected by ERP consumer via props
 */

import { Badge, Button, Card, Label, Separator, Switch } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import {
  CircleAlertIcon,
  LogOutIcon,
  MonitorIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useId } from "react";

export type AppShellAccountSettings06GovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Button" | "Card" | "Label" | "Separator" | "Switch"
>;

export interface AppShellAccountSettings06SessionRow {
  readonly id: string;
  readonly ipAddress: string | null;
  readonly isCurrent: boolean;
  readonly issuedAtLabel: string;
  readonly userAgent: string | null;
}

export interface AppShellAccountSettings06Props {
  readonly mfaPolicyPending?: boolean;
  readonly mfaPolicyRequired: boolean;
  readonly onDisableUserMfa?: () => void;
  readonly onEnableUserMfa?: () => void;
  readonly onMfaPolicyChange: (required: boolean) => void;
  readonly onRevokeOtherSessions?: () => void;
  readonly onRevokeSession?: (sessionId: string) => void;
  readonly sessions: readonly AppShellAccountSettings06SessionRow[];
  readonly sessionsPending?: boolean;
  readonly userMfaEnabled: boolean;
  readonly userMfaPending?: boolean;
}

export function AppShellAccountSettings06({
  mfaPolicyPending = false,
  mfaPolicyRequired,
  onDisableUserMfa,
  onEnableUserMfa,
  onMfaPolicyChange,
  onRevokeOtherSessions,
  onRevokeSession,
  sessions,
  sessionsPending = false,
  userMfaEnabled,
  userMfaPending = false,
}: AppShellAccountSettings06Props) {
  const tenantMfaPolicySectionId = useId();
  const tenantMfaPolicySwitchId = useId();
  const sessionsSectionId = useId();

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

      <Separator />

      <section
        aria-label="Two-factor authentication"
        className="app-shell-studio-account-settings-06__section"
      >
        <div className="app-shell-studio-account-settings-06__row">
          <div className="app-shell-studio-account-settings-06__aside">
            <h3 className="app-shell-studio-account-settings-06__title">
              Two-factor authentication
            </h3>
            <p className="app-shell-studio-account-settings-06__description">
              Manage your personal MFA enrollment status.
            </p>
          </div>
          <div className="app-shell-studio-account-settings-06__content">
            <Card>
              <div className="app-shell-studio-account-settings-06__panel">
                <div className="app-shell-studio-account-settings-06__status-row">
                  {userMfaEnabled ? (
                    <ShieldCheckIcon
                      aria-hidden
                      className="app-shell-studio-account-settings-06__status-icon"
                    />
                  ) : (
                    <CircleAlertIcon
                      aria-hidden
                      className="app-shell-studio-account-settings-06__status-icon"
                    />
                  )}
                  <div className="app-shell-studio-account-settings-06__status-copy">
                    <p className="app-shell-studio-account-settings-06__status-title">
                      {userMfaEnabled
                        ? "Two-factor authentication is enabled"
                        : "Two-factor authentication is not enabled"}
                    </p>
                    <p className="app-shell-studio-account-settings-06__description">
                      {userMfaEnabled
                        ? "Your account requires a second factor at sign-in."
                        : "Enable TOTP to add a second verification step at sign-in."}
                    </p>
                  </div>
                </div>
                <div className="app-shell-studio-account-settings-06__actions">
                  {userMfaEnabled ? (
                    <Button
                      aria-busy={userMfaPending}
                      disabled={
                        userMfaPending || onDisableUserMfa === undefined
                      }
                      emphasis="outline"
                      intent="destructive"
                      onClick={onDisableUserMfa}
                      presentation="default"
                      size="sm"
                      type="button"
                    >
                      Disable MFA
                    </Button>
                  ) : (
                    <Button
                      aria-busy={userMfaPending}
                      disabled={userMfaPending || onEnableUserMfa === undefined}
                      emphasis="solid"
                      intent="primary"
                      onClick={onEnableUserMfa}
                      presentation="default"
                      size="sm"
                      type="button"
                    >
                      Enable MFA
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      <section
        aria-labelledby={sessionsSectionId}
        className="app-shell-studio-account-settings-06__section"
      >
        <div className="app-shell-studio-account-settings-06__row">
          <div className="app-shell-studio-account-settings-06__aside">
            <h3
              className="app-shell-studio-account-settings-06__title"
              id={sessionsSectionId}
            >
              Active sessions
            </h3>
            <p className="app-shell-studio-account-settings-06__description">
              Review signed-in devices and revoke access you no longer trust.
            </p>
          </div>
          <div className="app-shell-studio-account-settings-06__content">
            <div className="app-shell-studio-account-settings-06__sessions-toolbar">
              <Button
                aria-busy={sessionsPending}
                disabled={
                  sessionsPending || onRevokeOtherSessions === undefined
                }
                emphasis="outline"
                intent="secondary"
                onClick={onRevokeOtherSessions}
                presentation="default"
                size="sm"
                type="button"
              >
                Sign out other devices
              </Button>
            </div>
            <div
              aria-busy={sessionsPending}
              className="app-shell-studio-account-settings-06__sessions-list"
              role="list"
            >
              {sessions.length === 0 ? (
                <p className="app-shell-studio-account-settings-06__description">
                  No active sessions were found.
                </p>
              ) : (
                sessions.map((session) => (
                  <article
                    className="app-shell-studio-account-settings-06__session-row"
                    key={session.id}
                    role="listitem"
                  >
                    <MonitorIcon
                      aria-hidden
                      className="app-shell-studio-account-settings-06__session-icon"
                    />
                    <div className="app-shell-studio-account-settings-06__session-copy">
                      <p className="app-shell-studio-account-settings-06__session-title">
                        {session.issuedAtLabel}
                        {session.isCurrent ? (
                          <Badge emphasis="soft" size="sm" tone="info">
                            Current
                          </Badge>
                        ) : null}
                      </p>
                      <p className="app-shell-studio-account-settings-06__description">
                        {session.ipAddress ?? "Unknown IP"}
                        {session.userAgent ? ` · ${session.userAgent}` : ""}
                      </p>
                    </div>
                    {!session.isCurrent && onRevokeSession ? (
                      <Button
                        aria-label={`Revoke session ${session.id}`}
                        disabled={sessionsPending}
                        emphasis="ghost"
                        intent="destructive"
                        onClick={() => {
                          onRevokeSession(session.id);
                        }}
                        presentation="icon"
                        size="sm"
                        type="button"
                      >
                        <LogOutIcon aria-hidden />
                      </Button>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
