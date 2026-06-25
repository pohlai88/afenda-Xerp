import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authClientMocks = vi.hoisted(() => ({
  getSession: vi.fn(),
}));

const multiSessionMocks = vi.hoisted(() => ({
  listDeviceSessions: vi.fn(),
  revoke: vi.fn(),
}));

const passkeyMocks = vi.hoisted(() => ({
  addPasskey: vi.fn(),
  deletePasskey: vi.fn(),
  listUserPasskeys: vi.fn(),
}));

const twoFactorMocks = vi.hoisted(() => ({
  disable: vi.fn(),
  enable: vi.fn(),
}));

const recordUserSessionRevokedActionMock = vi.hoisted(() => vi.fn());

vi.mock("@afenda/auth/client", () => ({
  authClient: {
    getSession: authClientMocks.getSession,
  },
  multiSession: multiSessionMocks,
  parseAfendaAuthDeviceSessions: (value: unknown) =>
    Array.isArray(value) ? value : [],
  passkey: passkeyMocks,
  resolvePasskeyDisplayLabel: (record: { name?: string | null }) =>
    record.name?.trim() || "Passkey",
  readAfendaAuthSessionTwoFactorEnabled: (value: unknown) => {
    if (
      typeof value === "object" &&
      value !== null &&
      "user" in value &&
      typeof (value as { user?: { twoFactorEnabled?: boolean } }).user
        ?.twoFactorEnabled === "boolean"
    ) {
      return (value as { user: { twoFactorEnabled: boolean } }).user
        .twoFactorEnabled;
    }

    return;
  },
  twoFactor: twoFactorMocks,
}));

vi.mock("@afenda/appshell", () => ({
  AppShellAccountSettings06User: ({
    onAddPasskey,
    onDeletePasskey,
    onDisableUserMfa,
    onEnableUserMfa,
    passkeys,
    userMfaEnabled,
  }: {
    onAddPasskey?: () => void;
    onDeletePasskey?: (passkeyId: string) => void;
    onDisableUserMfa?: () => void;
    onEnableUserMfa?: () => void;
    passkeys: Array<{ id: string; label: string }>;
    userMfaEnabled: boolean;
  }) => (
    <div>
      <p>{userMfaEnabled ? "MFA enabled" : "MFA disabled"}</p>
      <p>{passkeys.length === 0 ? "No passkeys" : passkeys[0]?.label}</p>
      <button onClick={onEnableUserMfa} type="button">
        Enable MFA
      </button>
      <button onClick={onDisableUserMfa} type="button">
        Disable MFA
      </button>
      <button onClick={onAddPasskey} type="button">
        Add passkey
      </button>
      {passkeys.map((passkeyRow) => (
        <button
          key={passkeyRow.id}
          onClick={() => {
            onDeletePasskey?.(passkeyRow.id);
          }}
          type="button"
        >
          Remove passkey {passkeyRow.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/lib/user-settings/record-user-session-revoked.action", () => ({
  recordUserSessionRevokedAction: recordUserSessionRevokedActionMock,
}));

import { UserSecuritySettingsPanel } from "@/components/user-settings/user-security-settings-panel";

describe("UserSecuritySettingsPanel", () => {
  beforeEach(() => {
    authClientMocks.getSession.mockReset();
    multiSessionMocks.listDeviceSessions.mockReset();
    multiSessionMocks.revoke.mockReset();
    passkeyMocks.addPasskey.mockReset();
    passkeyMocks.deletePasskey.mockReset();
    passkeyMocks.listUserPasskeys.mockReset();
    twoFactorMocks.disable.mockReset();
    twoFactorMocks.enable.mockReset();
    recordUserSessionRevokedActionMock.mockReset();
    recordUserSessionRevokedActionMock.mockResolvedValue({ ok: true });

    authClientMocks.getSession.mockResolvedValue({
      data: {
        session: { id: "sess-current", token: "token-current" },
        user: { twoFactorEnabled: false },
      },
    });
    multiSessionMocks.listDeviceSessions.mockResolvedValue({ data: [] });
    passkeyMocks.listUserPasskeys.mockResolvedValue({ data: [] });
  });

  it("renders personal MFA state without tenant policy controls", async () => {
    render(
      <UserSecuritySettingsPanel
        initialSettings={{
          userMfaEnabled: false,
        }}
      />
    );

    expect(
      screen.queryByRole("switch", { name: /enforce mfa/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/tenant mfa policy/i)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("MFA disabled")).toBeInTheDocument();
    });
  });

  it("loads passkeys on mount", async () => {
    passkeyMocks.listUserPasskeys.mockResolvedValue({
      data: [
        {
          id: "pk_1",
          name: "Work laptop",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    render(
      <UserSecuritySettingsPanel
        initialSettings={{
          userMfaEnabled: false,
        }}
      />
    );

    await waitFor(() => {
      expect(passkeyMocks.listUserPasskeys).toHaveBeenCalledWith({});
      expect(screen.getByText("Work laptop")).toBeInTheDocument();
    });
  });

  it("registers a passkey from the security panel", async () => {
    const user = setupUser();
    passkeyMocks.addPasskey.mockResolvedValue({ data: { id: "pk_new" } });

    render(
      <UserSecuritySettingsPanel
        initialSettings={{
          userMfaEnabled: false,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("No passkeys")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Add passkey" }));

    await waitFor(() => {
      expect(passkeyMocks.addPasskey).toHaveBeenCalledWith({});
      expect(passkeyMocks.listUserPasskeys).toHaveBeenCalledTimes(2);
    });
  });

  it("removes a passkey from the security panel", async () => {
    const user = setupUser();
    passkeyMocks.listUserPasskeys.mockResolvedValue({
      data: [
        {
          id: "pk_1",
          name: "Phone",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });
    passkeyMocks.deletePasskey.mockResolvedValue({ data: { id: "pk_1" } });

    render(
      <UserSecuritySettingsPanel
        initialSettings={{
          userMfaEnabled: false,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Phone")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Remove passkey Phone" })
    );

    await waitFor(() => {
      expect(passkeyMocks.deletePasskey).toHaveBeenCalledWith({ id: "pk_1" });
      expect(passkeyMocks.listUserPasskeys).toHaveBeenCalledTimes(2);
    });
  });

  it("starts MFA enrollment after password confirmation", async () => {
    const user = setupUser();

    render(
      <UserSecuritySettingsPanel
        initialSettings={{
          userMfaEnabled: false,
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Enable MFA" }));

    await user.type(screen.getByLabelText("Current password"), "password123");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(twoFactorMocks.enable).toHaveBeenCalledWith({
        password: "password123",
      });
    });
  });

  it("disables MFA after password confirmation", async () => {
    const user = setupUser();
    authClientMocks.getSession.mockResolvedValue({
      data: {
        session: { id: "sess-current", token: "token-current" },
        user: { twoFactorEnabled: true },
      },
    });

    render(
      <UserSecuritySettingsPanel
        initialSettings={{
          userMfaEnabled: true,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("MFA enabled")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Disable MFA" }));
    await user.type(screen.getByLabelText("Current password"), "password123");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(twoFactorMocks.disable).toHaveBeenCalledWith({
        password: "password123",
      });
    });
  });
});
