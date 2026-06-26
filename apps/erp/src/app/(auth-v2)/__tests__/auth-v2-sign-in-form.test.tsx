import type { SignInProviderSurface } from "@afenda/auth/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthV2SignInForm } from "@/app/(auth-v2)/_components/auth-v2-sign-in-form";

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

describe("AuthV2SignInForm", () => {
  it("renders credential fields and submit control", () => {
    render(<AuthV2SignInForm surface={defaultSurface} />);

    expect(screen.getByLabelText(/work email/i)).toBeTruthy();
    expect(screen.getByLabelText(/^password$/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /sign in with email/i })
    ).toBeTruthy();
  });
});
