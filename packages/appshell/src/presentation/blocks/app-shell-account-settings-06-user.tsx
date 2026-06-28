"use client";

/**
 * User-only slice of account-settings-06 — personal MFA + sessions (ARCH-USER-001 Slice 3).
 * Excludes tenant MFA policy section present on admin Security tab.
 */

import { Badge, Button, Card, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import {
  CircleAlertIcon,
  KeyRoundIcon,
  LogOutIcon,
  MonitorIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useId } from "react";

import type { AppShellAccountSettings06SessionRow } from "./app-shell-account-settings-06";

export type { AppShellAccountSettings06SessionRow };

export type AppShellAccountSettings06UserGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Button" | "Card" | "Separator"
>;

export interface AppShellAccountSettings06PasskeyRow {
  readonly createdAtLabel: string;
  readonly id: string;
  readonly label: string;
}

export interface AppShellAccountSettings06UserProps {
  readonly addPasskeyPending?: boolean;
  readonly deletePasskeyPendingId?: string | null;
  readonly onAddPasskey?: () => void;
  readonly onDeletePasskey?: (passkeyId: string) => void;
  readonly onDisableUserMfa?: () => void;
  readonly onEnableUserMfa?: () => void;
  readonly onRevokeOtherSessions?: () => void;
  readonly onRevokeSession?: (sessionId: string) => void;
  readonly passkeys: readonly AppShellAccountSettings06PasskeyRow[];
  readonly passkeysPending?: boolean;
  readonly sessions: readonly AppShellAccountSettings06SessionRow[];
  readonly sessionsPending?: boolean;
  readonly userMfaEnabled: boolean;
  readonly userMfaPending?: boolean;
}

export function AppShellAccountSettings06User({
  addPasskeyPending = false,
  deletePasskeyPendingId = null,
  onAddPasskey,
  onDeletePasskey,
  onDisableUserMfa,
  onEnableUserMfa,
  onRevokeOtherSessions,
  onRevokeSession,
  passkeys,
  passkeysPending = false,
  sessions,
  sessionsPending = false,
  userMfaEnabled,
  userMfaPending = false,
}: AppShellAccountSettings06UserProps) {
  const passkeysSectionId = useId();
  const sessionsSectionId = useId();

  return (
    <div className="app-shell-studio-account-settings-06">
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
        aria-labelledby={passkeysSectionId}
        className="app-shell-studio-account-settings-06__section"
      >
        <div className="app-shell-studio-account-settings-06__row">
          <div className="app-shell-studio-account-settings-06__aside">
            <h3
              className="app-shell-studio-account-settings-06__title"
              id={passkeysSectionId}
            >
              Passkeys
            </h3>
            <p className="app-shell-studio-account-settings-06__description">
              Register device passkeys for passwordless sign-in on trusted
              devices.
            </p>
          </div>
          <div className="app-shell-studio-account-settings-06__content">
            <div className="app-shell-studio-account-settings-06__sessions-toolbar">
              <Button
                aria-busy={addPasskeyPending}
                disabled={addPasskeyPending || onAddPasskey === undefined}
                emphasis="solid"
                intent="primary"
                onClick={onAddPasskey}
                presentation="default"
                size="sm"
                type="button"
              >
                Add passkey
              </Button>
            </div>
            <div
              aria-busy={passkeysPending}
              className="app-shell-studio-account-settings-06__sessions-list"
              role="list"
            >
              {passkeys.length === 0 ? (
                <p className="app-shell-studio-account-settings-06__description">
                  No passkeys are registered for this account.
                </p>
              ) : (
                passkeys.map((passkeyRow) => (
                  <article
                    className="app-shell-studio-account-settings-06__session-row"
                    key={passkeyRow.id}
                    role="listitem"
                  >
                    <KeyRoundIcon
                      aria-hidden
                      className="app-shell-studio-account-settings-06__session-icon"
                    />
                    <div className="app-shell-studio-account-settings-06__session-copy">
                      <p className="app-shell-studio-account-settings-06__session-title">
                        {passkeyRow.label}
                      </p>
                      <p className="app-shell-studio-account-settings-06__description">
                        {passkeyRow.createdAtLabel}
                      </p>
                    </div>
                    {onDeletePasskey ? (
                      <Button
                        aria-busy={deletePasskeyPendingId === passkeyRow.id}
                        aria-label={`Remove passkey ${passkeyRow.label}`}
                        disabled={
                          passkeysPending ||
                          deletePasskeyPendingId === passkeyRow.id
                        }
                        emphasis="outline"
                        intent="destructive"
                        onClick={() => {
                          onDeletePasskey(passkeyRow.id);
                        }}
                        presentation="default"
                        size="sm"
                        type="button"
                      >
                        Remove
                      </Button>
                    ) : null}
                  </article>
                ))
              )}
            </div>
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
