import type { SignInProviderSurface } from "@afenda/auth/client";
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

describe("AuthSignInForm — field accessibility", () => {
  it("email input has explicit id and its label is associated via htmlFor", () => {
    const { container } = render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    const emailInput = screen.getByLabelText(/work email/i);
    expect(emailInput.id).toBe("auth-email");

    const emailLabel = container.querySelector('label[for="auth-email"]');
    expect(emailLabel).not.toBeNull();
  });

  it("password input has explicit id and its label is associated via htmlFor", () => {
    const { container } = render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput.id).toBe("auth-password");

    const passwordLabel = container.querySelector('label[for="auth-password"]');
    expect(passwordLabel).not.toBeNull();
  });

  it("email input does not carry aria-invalid='true' in the initial error-free state", () => {
    render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    const emailInput = screen.getByLabelText(/work email/i);
    expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
  });

  it("password input does not carry aria-invalid='true' in the initial error-free state", () => {
    render(
      <AuthSignInForm
        devLoginPanel={DEV_LOGIN_PANEL_DISABLED}
        surface={defaultSurface}
      />
    );

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).not.toHaveAttribute("aria-invalid", "true");
  });
});
