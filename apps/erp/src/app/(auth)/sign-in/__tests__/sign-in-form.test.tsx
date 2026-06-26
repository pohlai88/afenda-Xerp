import { AppShellAuthLoginPage04 } from "@afenda/appshell";
import type { SignInProviderSurface } from "@afenda/auth/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SignInForm } from "../sign-in-form";

const signInMocks = vi.hoisted(() => ({
  email: vi.fn(),
  social: vi.fn(),
  sso: vi.fn(),
  passkey: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@afenda/auth/client", () => ({
  signIn: signInMocks,
}));

const emailOnlySurface: SignInProviderSurface = {
  passkeyEnabled: false,
  socialProviderIds: [],
  ssoEnabled: false,
};

const fullSurface: SignInProviderSurface = {
  passkeyEnabled: true,
  socialProviderIds: ["google", "microsoft"],
  ssoEnabled: true,
};

function renderSignIn(surface: SignInProviderSurface) {
  return render(
    <AppShellAuthLoginPage04>
      <SignInForm surface={surface} />
    </AppShellAuthLoginPage04>
  );
}

describe("SignInForm", () => {
  it("renders email/password sign-in without alternate methods", () => {
    renderSignIn(emailOnlySurface);

    expect(
      screen.getByRole("heading", { name: "Sign in" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with email" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Or continue with")).not.toBeInTheDocument();
  });

  it("renders governed alternate sign-in methods from server surface", () => {
    renderSignIn(fullSurface);

    expect(screen.getByText("Or sign in with email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Google" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Microsoft" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Passkey" })).toBeInTheDocument();
    expect(screen.getByLabelText("Work email for SSO")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with SSO" })
    ).toBeInTheDocument();
  });
});
