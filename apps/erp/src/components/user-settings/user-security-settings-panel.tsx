"use client";

import {
  type AppShellAccountSettings06PasskeyRow,
  type AppShellAccountSettings06SessionRow,
  AppShellAccountSettings06User,
} from "@afenda/appshell";
import {
  type AfendaAuthDeviceSession,
  authClient,
  multiSession,
  parseAfendaAuthDeviceSessions,
  passkey,
  readAfendaAuthSessionTwoFactorEnabled,
  resolvePasskeyDisplayLabel,
  twoFactor,
} from "@afenda/auth/client";
import { Button, Field, FieldLabel, Input } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useCallback, useEffect, useId, useState, useTransition } from "react";
import { recordUserSessionRevokedAction } from "@/lib/user-settings/record-user-session-revoked.action";
import type { UserSecuritySettingsViewModel } from "@/lib/user-settings/resolve-user-security-settings.server";

export interface UserSecuritySettingsPanelProps {
  readonly initialSettings: UserSecuritySettingsViewModel;
}

export type UserSecuritySettingsPanelGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Field" | "FieldLabel" | "Input"
>;

type UserMfaReauthIntent = "disable" | "enable";

interface PasskeyRecord {
  readonly aaguid?: string | null;
  readonly createdAt?: Date | string | null;
  readonly id: string;
  readonly name?: string | null;
}

function formatSessionIssuedAt(value: Date | string | undefined): string {
  if (value === undefined) {
    return "Unknown sign-in time";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown sign-in time";
  }

  return `Signed in ${date.toLocaleString()}`;
}

function formatPasskeyCreatedAt(
  value: Date | string | null | undefined
): string {
  if (value === undefined || value === null) {
    return "Registered on an unknown date";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Registered on an unknown date";
  }

  return `Registered ${date.toLocaleString()}`;
}

function resolvePasskeyLabel(record: PasskeyRecord): string {
  return resolvePasskeyDisplayLabel(record);
}

function mapPasskeyRows(
  items: readonly PasskeyRecord[]
): AppShellAccountSettings06PasskeyRow[] {
  return items.map((item) => ({
    id: item.id,
    label: resolvePasskeyLabel(item),
    createdAtLabel: formatPasskeyCreatedAt(item.createdAt),
  }));
}

function mapSessionRows(
  items: readonly AfendaAuthDeviceSession[],
  currentSessionId: string | null
): AppShellAccountSettings06SessionRow[] {
  return items.map(({ session }) => ({
    id: session.id,
    ipAddress: session.ipAddress ?? null,
    isCurrent: currentSessionId !== null && session.id === currentSessionId,
    issuedAtLabel: formatSessionIssuedAt(session.createdAt),
    userAgent: session.userAgent ?? null,
  }));
}

function findDeviceSessionById(
  items: readonly AfendaAuthDeviceSession[],
  sessionId: string
): AfendaAuthDeviceSession | undefined {
  return items.find((item) => item.session.id === sessionId);
}

function parsePasskeyList(value: unknown): PasskeyRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null || !("id" in item)) {
      return [];
    }

    const id = item.id;

    if (typeof id !== "string") {
      return [];
    }

    return [
      {
        id,
        ...(typeof item === "object" &&
        "name" in item &&
        (typeof item.name === "string" || item.name === null)
          ? { name: item.name }
          : {}),
        ...(typeof item === "object" &&
        "aaguid" in item &&
        (typeof item.aaguid === "string" || item.aaguid === null)
          ? { aaguid: item.aaguid }
          : {}),
        ...(typeof item === "object" &&
        "createdAt" in item &&
        (item.createdAt instanceof Date ||
          typeof item.createdAt === "string" ||
          item.createdAt === null)
          ? { createdAt: item.createdAt }
          : {}),
      },
    ];
  });
}

/**
 * User Security tab — personal MFA, passkeys, and sessions (ARCH-USER-001 Slice 3 + ARCH-AUTH-001 Slice 13b).
 */
export function UserSecuritySettingsPanel({
  initialSettings,
}: UserSecuritySettingsPanelProps) {
  const reauthPasswordFieldId = useId();
  const [userMfaEnabled, setUserMfaEnabled] = useState(
    initialSettings.userMfaEnabled
  );
  const [passkeys, setPasskeys] = useState<
    AppShellAccountSettings06PasskeyRow[]
  >([]);
  const [passkeysPending, setPasskeysPending] = useState(true);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [deletePasskeyPendingId, setDeletePasskeyPendingId] = useState<
    string | null
  >(null);
  const [sessions, setSessions] = useState<
    AppShellAccountSettings06SessionRow[]
  >([]);
  const [sessionsPending, setSessionsPending] = useState(true);
  const [userMfaReauthIntent, setUserMfaReauthIntent] =
    useState<UserMfaReauthIntent | null>(null);
  const [reauthPassword, setReauthPassword] = useState("");
  const [userMfaError, setUserMfaError] = useState<string | null>(null);
  const [userMfaPending, startUserMfaTransition] = useTransition();
  const [addPasskeyPending, startAddPasskeyTransition] = useTransition();

  const refreshUserMfaFromSession = useCallback(async () => {
    const sessionState = await authClient.getSession();
    const fromSession = readAfendaAuthSessionTwoFactorEnabled(
      sessionState.data
    );

    if (fromSession !== undefined) {
      setUserMfaEnabled(fromSession);
    }
  }, []);

  const loadPasskeys = useCallback(async () => {
    setPasskeysPending(true);

    try {
      const listResult = await passkey.listUserPasskeys({});
      setPasskeys(mapPasskeyRows(parsePasskeyList(listResult.data)));
    } finally {
      setPasskeysPending(false);
    }
  }, []);

  const loadSessions = useCallback(async () => {
    setSessionsPending(true);

    try {
      const [sessionState, listResult] = await Promise.all([
        authClient.getSession(),
        multiSession.listDeviceSessions(),
      ]);

      const currentSessionId = sessionState.data?.session.id ?? null;
      const deviceSessions = parseAfendaAuthDeviceSessions(listResult.data);

      setSessions(mapSessionRows(deviceSessions, currentSessionId));
      await refreshUserMfaFromSession();
    } finally {
      setSessionsPending(false);
    }
  }, [refreshUserMfaFromSession]);

  const loadSecurityData = useCallback(async () => {
    await Promise.all([loadPasskeys(), loadSessions()]);
  }, [loadPasskeys, loadSessions]);

  useEffect(() => {
    void loadSecurityData();
  }, [loadSecurityData]);

  const handleAddPasskey = () => {
    startAddPasskeyTransition(async () => {
      setPasskeyError(null);

      try {
        const result = await passkey.addPasskey({});

        if (result.error) {
          setPasskeyError(
            result.error.message ?? "Unable to register a passkey."
          );
          return;
        }

        await loadPasskeys();
      } catch (error: unknown) {
        setPasskeyError(
          error instanceof Error
            ? error.message
            : "Passkey registration failed. Try again."
        );
      }
    });
  };

  const handleDeletePasskey = (passkeyId: string) => {
    void (async () => {
      setDeletePasskeyPendingId(passkeyId);
      setPasskeyError(null);

      try {
        const result = await passkey.deletePasskey({ id: passkeyId });

        if (result.error) {
          setPasskeyError(result.error.message ?? "Unable to remove passkey.");
          return;
        }

        await loadPasskeys();
      } catch (error: unknown) {
        setPasskeyError(
          error instanceof Error
            ? error.message
            : "Passkey removal failed. Try again."
        );
      } finally {
        setDeletePasskeyPendingId(null);
      }
    })();
  };

  const handleRevokeSession = (sessionId: string) => {
    void (async () => {
      setSessionsPending(true);

      try {
        const listResult = await multiSession.listDeviceSessions();
        const deviceSessions = parseAfendaAuthDeviceSessions(listResult.data);
        const match = findDeviceSessionById(deviceSessions, sessionId);

        if (match?.session.token) {
          await multiSession.revoke({
            sessionToken: match.session.token,
          });
          await recordUserSessionRevokedAction(sessionId);
        }

        await loadSessions();
      } finally {
        setSessionsPending(false);
      }
    })();
  };

  const handleRevokeOtherSessions = () => {
    void (async () => {
      setSessionsPending(true);

      try {
        const [sessionState, listResult] = await Promise.all([
          authClient.getSession(),
          multiSession.listDeviceSessions(),
        ]);

        const currentToken = sessionState.data?.session.token ?? null;
        const deviceSessions = parseAfendaAuthDeviceSessions(listResult.data);

        if (currentToken !== null) {
          await Promise.all(
            deviceSessions
              .filter((item) => item.session.token !== currentToken)
              .map(async (item) => {
                await multiSession.revoke({
                  sessionToken: item.session.token,
                });
                await recordUserSessionRevokedAction(item.session.id);
              })
          );
        }

        await loadSessions();
      } finally {
        setSessionsPending(false);
      }
    })();
  };

  const openUserMfaReauth = (intent: UserMfaReauthIntent) => {
    setUserMfaError(null);
    setReauthPassword("");
    setUserMfaReauthIntent(intent);
  };

  const cancelUserMfaReauth = () => {
    setUserMfaReauthIntent(null);
    setReauthPassword("");
    setUserMfaError(null);
  };

  const submitUserMfaReauth = () => {
    if (userMfaReauthIntent === null) {
      return;
    }

    const password = reauthPassword.trim();

    if (password.length === 0) {
      setUserMfaError("Enter your current password to continue.");
      return;
    }

    startUserMfaTransition(async () => {
      setUserMfaError(null);

      try {
        if (userMfaReauthIntent === "enable") {
          const result = await twoFactor.enable({ password });

          if (result.error) {
            setUserMfaError(
              result.error.message ?? "Unable to start MFA enrollment."
            );
            return;
          }
        } else {
          const result = await twoFactor.disable({ password });

          if (result.error) {
            setUserMfaError(result.error.message ?? "Unable to disable MFA.");
            return;
          }
        }

        cancelUserMfaReauth();
        await refreshUserMfaFromSession();
      } catch (error: unknown) {
        setUserMfaError(
          error instanceof Error
            ? error.message
            : "MFA update failed. Try again."
        );
      }
    });
  };

  return (
    <>
      {userMfaReauthIntent === null ? null : (
        <section
          aria-labelledby={`${reauthPasswordFieldId}-label`}
          className="erp-user-security-settings-reauth"
        >
          <p
            className="erp-system-admin-settings-form__message"
            id={`${reauthPasswordFieldId}-label`}
          >
            {userMfaReauthIntent === "enable"
              ? "Confirm your password to start MFA enrollment."
              : "Confirm your password to disable MFA."}
          </p>
          <Field orientation="vertical">
            <FieldLabel htmlFor={reauthPasswordFieldId}>
              Current password
            </FieldLabel>
            <Input
              autoComplete="current-password"
              disabled={userMfaPending}
              id={reauthPasswordFieldId}
              onChange={(event) => {
                setReauthPassword(event.target.value);
              }}
              type="password"
              value={reauthPassword}
            />
          </Field>
          {userMfaError === null ? null : (
            <p className="erp-system-admin-settings-form__message" role="alert">
              {userMfaError}
            </p>
          )}
          <div className="erp-system-admin-settings-form__actions">
            <Button
              disabled={userMfaPending}
              emphasis="solid"
              intent="primary"
              onClick={submitUserMfaReauth}
              presentation="default"
              size="md"
              type="button"
            >
              Confirm
            </Button>
            <Button
              disabled={userMfaPending}
              emphasis="outline"
              intent="secondary"
              onClick={cancelUserMfaReauth}
              presentation="default"
              size="md"
              type="button"
            >
              Cancel
            </Button>
          </div>
        </section>
      )}

      {passkeyError === null ? null : (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {passkeyError}
        </p>
      )}

      <AppShellAccountSettings06User
        addPasskeyPending={addPasskeyPending}
        deletePasskeyPendingId={deletePasskeyPendingId}
        onAddPasskey={handleAddPasskey}
        onDeletePasskey={handleDeletePasskey}
        onDisableUserMfa={() => openUserMfaReauth("disable")}
        onEnableUserMfa={() => openUserMfaReauth("enable")}
        onRevokeOtherSessions={handleRevokeOtherSessions}
        onRevokeSession={handleRevokeSession}
        passkeys={passkeys}
        passkeysPending={passkeysPending}
        sessions={sessions}
        sessionsPending={sessionsPending}
        userMfaEnabled={userMfaEnabled}
        userMfaPending={userMfaPending}
      />
    </>
  );
}
