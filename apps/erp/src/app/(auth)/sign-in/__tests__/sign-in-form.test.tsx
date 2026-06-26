import type { SignInProviderSurface } from "@afenda/auth/client";
import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { SignInForm } from "@/app/(auth)/_components/sign-in-form";

const signInMocks = vi.hoisted(() => ({
  email: vi.fn(),
  social: vi.fn(),
  sso: vi.fn(),
  passkey: vi.fn(),
}));

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
}));

const authFlowMocks = vi.hoisted(() => ({
  fetchPostAuthEntryPath: vi.fn(),
  persistMfaChallengeAction: vi.fn(),
}));

let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
  useSearchParams: () => searchParams,
}));

vi.mock("@afenda/auth/client", () => ({
  signIn: signInMocks,
}));

vi.mock("@/lib/auth/auth-mfa-challenge.action", () => ({
  persistMfaChallengeAction: authFlowMocks.persistMfaChallengeAction,
}));

vi.mock("@/lib/auth/fetch-post-auth-entry-path.client", () => ({
  fetchPostAuthEntryPath: authFlowMocks.fetchPostAuthEntryPath,
}));

vi.mock("@/lib/auth/use-passkey-conditional-ui", () => ({
  usePasskeyConditionalUi: vi.fn(),
}));

const emailOnlySurface: SignInProviderSurface = {
  passkeyEnabled: false,
  socialProviderIds: [],
  ssoEnabled: false,
};

const fullSurface: SignInProviderSurface = {
  passkeyEnabled: true,
  socialProviderIds: ["google", "github"],
  ssoEnabled: true,
};

function renderSignIn(surface: SignInProviderSurface) {
  return render(
    <AuthEntryPage route="signIn">
      <SignInForm surface={surface} />
    </AuthEntryPage>
  );
}

describe("SignInForm", () => {
  beforeEach(() => {
    searchParams = new URLSearchParams();
    signInMocks.email.mockReset();
    routerMocks.replace.mockReset();
    routerMocks.refresh.mockReset();
    authFlowMocks.persistMfaChallengeAction.mockReset();
    authFlowMocks.persistMfaChallengeAction.mockResolvedValue(undefined);
    authFlowMocks.fetchPostAuthEntryPath.mockReset();
    authFlowMocks.fetchPostAuthEntryPath.mockResolvedValue("/");
    // biome-ignore lint/suspicious/noDocumentCookie: test isolation for auth cookie helpers
    document.cookie = "";
  });

  it("renders entry notice copy from query params", () => {
    searchParams = new URLSearchParams("notice=verify-email");
    renderSignIn(emailOnlySurface);

    expect(
      screen.getByText(/Check your email for a verification link/i)
    ).toBeInTheDocument();
  });

  it("redirects to MFA route when Better Auth requests 2FA", async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    });

    signInMocks.email.mockImplementation(
      async (
        _credentials: unknown,
        options?: {
          onSuccess?: (context: { data: unknown }) => void;
        }
      ) => {
        options?.onSuccess?.({
          data: { twoFactorRedirect: true, twoFactorMethods: ["totp"] },
        });
        return { data: null, error: null };
      }
    );

    const user = setupUser();
    renderSignIn(emailOnlySurface);

    await user.type(screen.getByLabelText("Work email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(
      screen.getByRole("button", { name: /sign in with email/i })
    );

    await waitFor(() => {
      expect(authFlowMocks.persistMfaChallengeAction).toHaveBeenCalledWith(
        { methods: ["totp"] },
        null
      );
      expect(routerMocks.replace).toHaveBeenCalledWith("/mfa");
    });
  });

  it("redirects after successful credential sign-in", async () => {
    signInMocks.email.mockResolvedValue({ data: {}, error: null });
    const user = setupUser();
    renderSignIn(emailOnlySurface);

    await user.type(screen.getByLabelText("Work email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(
      screen.getByRole("button", { name: /sign in with email/i })
    );

    await waitFor(() => {
      expect(authFlowMocks.fetchPostAuthEntryPath).toHaveBeenCalledWith(null);
      expect(routerMocks.replace).toHaveBeenCalledWith("/");
    });
  });

  it("renders email/password sign-in without alternate methods", () => {
    renderSignIn(emailOnlySurface);

    expect(
      screen.getByRole("heading", { name: "Sign in to Afenda ERP" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Work email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in with email/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Forgot password?" })[0]
    ).toHaveAttribute("href", "/forgot-password");
    expect(screen.queryByText("Or continue with")).not.toBeInTheDocument();
  });

  it("renders governed alternate sign-in methods from server surface", () => {
    renderSignIn(fullSurface);

    expect(screen.getByText("Alternate entry")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Google" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Passkey" })).toBeInTheDocument();
    expect(screen.getByLabelText("Organization email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with SSO" })
    ).toBeInTheDocument();
  });
});
