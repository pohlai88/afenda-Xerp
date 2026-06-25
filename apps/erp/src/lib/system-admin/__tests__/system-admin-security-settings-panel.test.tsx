import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authClientMocks = vi.hoisted(() => ({
  getSession: vi.fn(),
}));

const twoFactorMocks = vi.hoisted(() => ({
  disable: vi.fn(),
  enable: vi.fn(),
  verifyTotp: vi.fn(),
}));

const updateSecurityMfaPolicyActionMock = vi.hoisted(() => vi.fn());

vi.mock("@afenda/auth/client", () => ({
  authClient: {
    getSession: authClientMocks.getSession,
  },
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

vi.mock("@afenda/appshell", async (importOriginal) => {
  const original = await importOriginal<typeof import("@afenda/appshell")>();

  return {
    ...original,
    AppShellAccountSettings06: ({
      mfaPolicyRequired,
      onConfirmReauth,
      onEnableUserMfa,
      onMfaPolicyChange,
      onReauthPasswordChange,
      userMfaEnabled,
    }: {
      mfaPolicyRequired: boolean;
      onConfirmReauth?: () => void;
      onEnableUserMfa?: () => void;
      onMfaPolicyChange: (required: boolean) => void;
      onReauthPasswordChange?: (value: string) => void;
      userMfaEnabled: boolean;
    }) => (
      <div>
        <p>{mfaPolicyRequired ? "Policy enforced" : "Policy optional"}</p>
        <p>{userMfaEnabled ? "MFA enabled" : "MFA disabled"}</p>
        <button onClick={() => onMfaPolicyChange(true)} type="button">
          Enforce tenant MFA
        </button>
        <button onClick={onEnableUserMfa} type="button">
          Enable MFA
        </button>
        <label htmlFor="mock-reauth-password">Current password</label>
        <input
          id="mock-reauth-password"
          onChange={(event) => {
            onReauthPasswordChange?.(event.target.value);
          }}
          type="password"
        />
        <button onClick={onConfirmReauth} type="button">
          Confirm MFA reauth
        </button>
      </div>
    ),
  };
});

vi.mock("@/lib/system-admin/update-security-mfa-policy.action", () => ({
  updateSecurityMfaPolicyAction: updateSecurityMfaPolicyActionMock,
}));

import { SystemAdminSecuritySettingsPanel } from "@/components/system-admin/system-admin-security-settings-panel";

describe("SystemAdminSecuritySettingsPanel", () => {
  beforeEach(() => {
    updateSecurityMfaPolicyActionMock.mockReset();
    updateSecurityMfaPolicyActionMock.mockResolvedValue({
      ok: true,
      data: { mfaRequired: true },
    });
    authClientMocks.getSession.mockReset();
    twoFactorMocks.disable.mockReset();
    twoFactorMocks.enable.mockReset();
    twoFactorMocks.verifyTotp.mockReset();

    authClientMocks.getSession.mockResolvedValue({
      data: {
        user: { twoFactorEnabled: false },
      },
    });
    twoFactorMocks.enable.mockResolvedValue({
      data: {
        totpURI: "otpauth://totp/Afenda:user@example.com?secret=TEST",
        backupCodes: ["code-1", "code-2"],
      },
    });
    twoFactorMocks.verifyTotp.mockResolvedValue({ data: {} });
    twoFactorMocks.disable.mockResolvedValue({ data: {} });
  });

  it("renders tenant MFA policy and personal MFA status", () => {
    render(
      <SystemAdminSecuritySettingsPanel
        initialSettings={{
          mfaPolicyRequired: false,
          userMfaEnabled: false,
        }}
      />
    );

    expect(screen.getByText("Policy optional")).toBeInTheDocument();
    expect(screen.getByText("MFA disabled")).toBeInTheDocument();
  });

  it("wires tenant MFA policy change through updateSecurityMfaPolicyAction", async () => {
    const user = setupUser();

    render(
      <SystemAdminSecuritySettingsPanel
        initialSettings={{
          mfaPolicyRequired: false,
          userMfaEnabled: false,
        }}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Enforce tenant MFA" })
    );

    await waitFor(() => {
      expect(updateSecurityMfaPolicyActionMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Policy enforced")).toBeInTheDocument();
    });
  });

  it("starts MFA enrollment via twoFactor.enable after password confirmation", async () => {
    const user = setupUser();

    render(
      <SystemAdminSecuritySettingsPanel
        initialSettings={{
          mfaPolicyRequired: false,
          userMfaEnabled: false,
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Enable MFA" }));
    await user.type(screen.getByLabelText("Current password"), "password123");
    await user.click(
      screen.getByRole("button", { name: "Confirm MFA reauth" })
    );

    await waitFor(() => {
      expect(twoFactorMocks.enable).toHaveBeenCalledWith({
        password: "password123",
      });
    });
  });
});
