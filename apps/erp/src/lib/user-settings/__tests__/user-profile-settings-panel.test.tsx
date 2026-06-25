import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authClientMocks = vi.hoisted(() => ({
  changeEmail: vi.fn(),
  changePassword: vi.fn(),
}));

const changeEmailEnabledState = vi.hoisted(() => ({
  enabled: true,
}));

vi.mock("@afenda/auth/client", () => ({
  authClient: {
    changeEmail: authClientMocks.changeEmail,
    changePassword: authClientMocks.changePassword,
  },
  isAuthChangeEmailEnabled: () => changeEmailEnabledState.enabled,
}));

vi.mock("@afenda/appshell", () => ({
  AppShellAccountSettings01: ({
    emailPasswordSection,
    personalInfoSection,
  }: {
    emailPasswordSection: ReactNode;
    personalInfoSection: ReactNode;
  }) => (
    <div>
      {personalInfoSection}
      {emailPasswordSection}
    </div>
  ),
  AppShellAccountSettingsPanelSection: ({
    children,
    title,
  }: {
    children: ReactNode;
    title: string;
  }) => <section aria-label={title}>{children}</section>,
}));

vi.mock("@/lib/user-settings/update-user-profile-settings.action", () => ({
  UPDATE_USER_PROFILE_SETTINGS_INTENT: "update-profile",
  updateUserProfileSettingsAction: vi.fn(),
}));

import { UserProfileSettingsPanel } from "@/components/user-settings/user-profile-settings-panel";

describe("UserProfileSettingsPanel", () => {
  beforeEach(() => {
    authClientMocks.changeEmail.mockReset();
    authClientMocks.changePassword.mockReset();
    changeEmailEnabledState.enabled = true;

    authClientMocks.changeEmail.mockResolvedValue({ data: {}, error: null });
    authClientMocks.changePassword.mockResolvedValue({ data: {}, error: null });
  });

  it("renders change-email flow when auth changeEmail is enabled", async () => {
    const user = setupUser();

    render(
      <UserProfileSettingsPanel
        profile={{
          displayName: "Test User",
          email: "user@example.com",
          emailVerified: true,
        }}
      />
    );

    expect(screen.getByLabelText("New email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Change email" })
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("New email"), "new@example.com");
    await user.click(screen.getByRole("button", { name: "Change email" }));

    await waitFor(() => {
      expect(authClientMocks.changeEmail).toHaveBeenCalledWith({
        newEmail: "new@example.com",
        callbackURL: "/settings/profile",
      });
    });

    expect(screen.getByText(/verification email sent/i)).toBeInTheDocument();
  });

  it("keeps email read-only when changeEmail is disabled", () => {
    changeEmailEnabledState.enabled = false;

    render(
      <UserProfileSettingsPanel
        profile={{
          displayName: "Test User",
          email: "user@example.com",
          emailVerified: true,
        }}
      />
    );

    expect(screen.queryByLabelText("New email")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Change email" })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("readonly");
  });

  it("surfaces change-email errors from authClient", async () => {
    const user = setupUser();
    authClientMocks.changeEmail.mockResolvedValue({
      data: null,
      error: { message: "Email already in use." },
    });

    render(
      <UserProfileSettingsPanel
        profile={{
          displayName: "Test User",
          email: "user@example.com",
          emailVerified: true,
        }}
      />
    );

    await user.type(screen.getByLabelText("New email"), "taken@example.com");
    await user.click(screen.getByRole("button", { name: "Change email" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Email already in use."
      );
    });
  });
});
