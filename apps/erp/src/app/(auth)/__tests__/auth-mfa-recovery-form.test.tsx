import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthMfaRecoveryForm } from "@/app/(auth)/_components/auth-mfa-recovery-form";

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@afenda/auth/client", () => ({
  twoFactor: {
    verifyTotp: vi.fn(),
    verifyOtp: vi.fn(),
    verifyBackupCode: vi.fn(),
    sendOtp: vi.fn(),
  },
}));

vi.mock("@/lib/auth/auth-mfa-challenge.action", () => ({
  clearMfaChallengeAction: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/auth/fetch-post-auth-entry-path.client", () => ({
  fetchPostAuthEntryPath: vi.fn().mockResolvedValue("/protected"),
}));

describe("AuthMfaRecoveryForm — explicit backup-code variant", () => {
  it("renders missing-challenge notice when initialPayload is null", () => {
    render(<AuthMfaRecoveryForm initialPayload={null} />);

    expect(screen.getByText(/your verification session expired/i)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /return to sign in/i })
    ).toBeTruthy();
  });

  it("renders backup code input when a challenge payload is provided", () => {
    render(
      <AuthMfaRecoveryForm
        initialPayload={{
          challenge: { methods: ["totp"] },
          nextPath: "/protected",
        }}
      />
    );

    expect(screen.getByText(/enter a backup code/i)).toBeTruthy();
    expect(screen.getByLabelText(/backup code/i)).toBeTruthy();
  });

  it("does not render other MFA mode switchers for the backup-code-only variant", () => {
    render(
      <AuthMfaRecoveryForm
        initialPayload={{
          challenge: { methods: ["totp"] },
          nextPath: "/protected",
        }}
      />
    );

    expect(screen.queryByText(/use authenticator code/i)).toBeNull();
    expect(screen.queryByText(/use email code/i)).toBeNull();
  });
});
