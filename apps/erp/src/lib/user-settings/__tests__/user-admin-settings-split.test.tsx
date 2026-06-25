import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@afenda/appshell", () => ({
  AppShellAccountSettings06User: () => (
    <div data-testid="user-security-slice">User security slice</div>
  ),
  AppShellAccountSettings06Policy: () => (
    <div data-testid="admin-security-policy">Admin MFA policy</div>
  ),
}));

vi.mock("@afenda/auth/client", () => ({
  authClient: {
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: { id: "sess-split", token: "token-split" },
        user: { twoFactorEnabled: false },
      },
    }),
  },
  multiSession: {
    listDeviceSessions: vi.fn().mockResolvedValue({ data: [] }),
  },
  parseAfendaAuthDeviceSessions: () => [],
  readAfendaAuthSessionTwoFactorEnabled: () => undefined,
  twoFactor: { disable: vi.fn(), enable: vi.fn() },
}));

vi.mock("@/lib/user-settings/record-user-session-revoked.action", () => ({
  recordUserSessionRevokedAction: vi.fn(),
}));

vi.mock("@/lib/system-admin/update-security-mfa-policy.action", () => ({
  updateSecurityMfaPolicyAction: vi.fn(),
}));

import { SystemAdminSecuritySettingsPanel } from "@/components/system-admin/system-admin-security-settings-panel";
import { UserSecuritySettingsPanel } from "@/components/user-settings/user-security-settings-panel";

describe("user/admin security surface split (AC-U13)", () => {
  it("routes user security to block 06 user slice and admin to policy slice", () => {
    const { unmount: unmountUser } = render(
      <UserSecuritySettingsPanel
        initialSettings={{
          userMfaEnabled: false,
        }}
      />
    );

    expect(screen.getByTestId("user-security-slice")).toBeInTheDocument();
    expect(
      screen.queryByTestId("admin-security-policy")
    ).not.toBeInTheDocument();
    unmountUser();

    render(
      <SystemAdminSecuritySettingsPanel
        initialSettings={{
          mfaPolicyRequired: false,
        }}
      />
    );

    expect(screen.getByTestId("admin-security-policy")).toBeInTheDocument();
    expect(screen.queryByTestId("user-security-slice")).not.toBeInTheDocument();
  });
});
