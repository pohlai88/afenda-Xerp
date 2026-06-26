import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthDevLoginPanel } from "@/app/(auth)/_components/auth-dev-login-panel";
import type { DevLoginPanelState } from "@/lib/auth/dev-login-panel.contract";

const readyPanel = {
  enabled: true,
  status: "ready",
  tenantSlug: "dev-local",
  accounts: [
    {
      email: "dev-admin@localhost.afenda",
      id: "admin",
      label: "Dev Workspace Admin",
      password: "DevLocalLogin!23",
    },
    {
      email: "dev-viewer@localhost.afenda",
      id: "viewer",
      label: "Dev Workspace Viewer",
      password: "DevLocalLogin!23-viewer",
    },
  ],
} satisfies Extract<DevLoginPanelState, { status: "ready" }>;

describe("AuthDevLoginPanel", () => {
  it("renders account credentials and action controls", async () => {
    window.localStorage.setItem("afenda-dev-login-panel-open", "open");

    render(
      <AuthDevLoginPanel
        onFillCredentials={vi.fn()}
        onQuickSignIn={vi.fn()}
        panel={readyPanel}
      />
    );

    expect(await screen.findByText("Dev Workspace Admin")).toBeTruthy();
    expect(screen.getByText("dev-admin@localhost.afenda")).toBeTruthy();
    await waitFor(() => {
      expect(
        screen.getAllByRole("button", { name: /fill form/i })
      ).toHaveLength(2);
    });
    expect(screen.getAllByRole("button", { name: /^sign in$/i })).toHaveLength(
      2
    );
  });

  it("invokes fill and quick sign-in callbacks", async () => {
    window.localStorage.setItem("afenda-dev-login-panel-open", "open");
    const onFillCredentials = vi.fn();
    const onQuickSignIn = vi.fn();
    const user = setupUser();

    render(
      <AuthDevLoginPanel
        onFillCredentials={onFillCredentials}
        onQuickSignIn={onQuickSignIn}
        panel={readyPanel}
      />
    );

    const fillButton = screen
      .getAllByRole("button", { name: /fill form/i })
      .at(0);
    if (fillButton === undefined) {
      throw new Error("Expected a fill form button");
    }
    await user.click(fillButton);
    expect(onFillCredentials).toHaveBeenCalledWith(readyPanel.accounts[0]);

    const signInButton = screen
      .getAllByRole("button", { name: /^sign in$/i })
      .at(0);
    if (signInButton === undefined) {
      throw new Error("Expected a sign in button");
    }
    await user.click(signInButton);
    expect(onQuickSignIn).toHaveBeenCalledWith(readyPanel.accounts[0]);
  });
});
