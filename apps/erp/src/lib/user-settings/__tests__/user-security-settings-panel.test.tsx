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
    onDisableUserMfa,
    onEnableUserMfa,
    userMfaEnabled,
  }: {
    onDisableUserMfa?: () => void;
    onEnableUserMfa?: () => void;
    userMfaEnabled: boolean;
  }) => (
    <div>
      <p>{userMfaEnabled ? "MFA enabled" : "MFA disabled"}</p>
      <button onClick={onEnableUserMfa} type="button">
        Enable MFA
      </button>
      <button onClick={onDisableUserMfa} type="button">
        Disable MFA
      </button>
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
