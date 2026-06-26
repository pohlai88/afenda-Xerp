import type { SignInProviderSurface } from "@afenda/auth/client";
import { signIn } from "@afenda/auth/client";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthSignInForm } from "@/app/(auth)/_components/auth-sign-in-form";
import { DEV_LOGIN_PANEL_DISABLED } from "@/lib/auth/dev-login-panel.contract";

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@afenda/auth/client", () => ({
  signIn: {
    email: vi.fn(),
    social: vi.fn(),
    sso: vi.fn(),
    passkey: vi.fn(),
  },
}));

const defaultSurface: SignInProviderSurface = {
  passkeyEnabled: false,
  socialProviderIds: [],
  ssoEnabled: false,
};

describe("AuthSignInForm", () => {
  it("renders credential fields and submit control", () => {
    render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    expect(screen.getByLabelText(/work email/i)).toBeTruthy();
    expect(screen.getByLabelText(/^password$/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /sign in with email/i })
    ).toBeTruthy();
  });
});

describe("AuthSignInForm — submit button state", () => {
  it("submit button is enabled with no aria-busy in the initial ready state", () => {
    render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    const button = screen.getByRole("button", { name: /sign in with email/i });
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute("aria-busy");
  });

  it("submit button has type=submit and primary intent for keyboard form submission", () => {
    render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    const button = screen.getByRole("button", { name: /sign in with email/i });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("data-intent", "primary");
  });
});

describe("AuthSignInForm — email sign-in", () => {
  it("submits credentials through signIn.email", async () => {
    const user = setupUser();

    vi.mocked(signIn.email).mockResolvedValueOnce({
      data: {},
      error: null,
    });

    render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    await user.type(screen.getByLabelText(/work email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(
      screen.getByRole("button", { name: /sign in with email/i })
    );

    expect(signIn.email).toHaveBeenCalledWith(
      {
        email: "test@example.com",
        password: "password123",
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );
  });
});
