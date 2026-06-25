import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AppShellAccountSettings06,
  type AppShellAccountSettings06SessionRow,
} from "../shadcn-studio/blocks/app-shell-account-settings-06";

const sessions: AppShellAccountSettings06SessionRow[] = [
  {
    id: "sess_1",
    issuedAtLabel: "Signed in today",
    ipAddress: "127.0.0.1",
    userAgent: "vitest",
    isCurrent: true,
  },
  {
    id: "sess_2",
    issuedAtLabel: "Signed in yesterday",
    ipAddress: "10.0.0.2",
    userAgent: "Chrome",
    isCurrent: false,
  },
];

describe("AppShellAccountSettings06", () => {
  it("renders tenant MFA policy, user MFA status, and sessions", () => {
    render(
      <AppShellAccountSettings06
        mfaPolicyRequired
        onMfaPolicyChange={vi.fn()}
        sessions={sessions}
        userMfaEnabled={false}
      />
    );

    expect(screen.getByText("Tenant MFA policy")).toBeInTheDocument();
    expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
    expect(screen.getByText("Active sessions")).toBeInTheDocument();
    expect(screen.getByText("Signed in yesterday")).toBeInTheDocument();
  });

  it("calls MFA policy and session revoke handlers", async () => {
    const user = setupUser();
    const onMfaPolicyChange = vi.fn();
    const onRevokeSession = vi.fn();

    render(
      <AppShellAccountSettings06
        mfaPolicyRequired={false}
        onEnableUserMfa={vi.fn()}
        onMfaPolicyChange={onMfaPolicyChange}
        onRevokeSession={onRevokeSession}
        sessions={sessions}
        userMfaEnabled={false}
      />
    );

    await user.click(
      screen.getByRole("switch", { name: "Enforce MFA for workspace access" })
    );
    expect(onMfaPolicyChange).toHaveBeenCalledWith(true);

    await user.click(
      screen.getByRole("button", { name: "Revoke session sess_2" })
    );
    expect(onRevokeSession).toHaveBeenCalledWith("sess_2");
  });
});
