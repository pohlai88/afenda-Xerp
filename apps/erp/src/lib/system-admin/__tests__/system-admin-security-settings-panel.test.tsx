import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateSecurityMfaPolicyActionMock = vi.hoisted(() => vi.fn());

vi.mock("@afenda/appshell", () => ({
  AppShellAccountSettings06Policy: ({
    mfaPolicyRequired,
    onMfaPolicyChange,
  }: {
    mfaPolicyRequired: boolean;
    onMfaPolicyChange: (required: boolean) => void;
  }) => (
    <div>
      <p>{mfaPolicyRequired ? "Policy enforced" : "Policy optional"}</p>
      <button onClick={() => onMfaPolicyChange(true)} type="button">
        Enforce tenant MFA
      </button>
    </div>
  ),
}));

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
  });

  it("renders tenant MFA policy only — no personal MFA or session controls", () => {
    render(
      <SystemAdminSecuritySettingsPanel
        initialSettings={{
          mfaPolicyRequired: false,
        }}
      />
    );

    expect(screen.getByText("Policy optional")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Enable MFA" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/active sessions/i)).not.toBeInTheDocument();
  });

  it("wires tenant MFA policy change through updateSecurityMfaPolicyAction", async () => {
    const user = setupUser();

    render(
      <SystemAdminSecuritySettingsPanel
        initialSettings={{
          mfaPolicyRequired: false,
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
});
