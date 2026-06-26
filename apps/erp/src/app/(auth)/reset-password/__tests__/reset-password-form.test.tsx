import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { ResetPasswordForm } from "@/app/(auth)/_components/reset-password-form";

const resetMocks = vi.hoisted(() => ({
  submit: vi.fn(),
}));

const navigationMocks = vi.hoisted(() => ({
  searchParams: new URLSearchParams("token=reset_token"),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => navigationMocks.searchParams,
}));

vi.mock("@/lib/auth/submit-password-reset.client", () => ({
  submitPasswordReset: resetMocks.submit,
}));

describe("ResetPasswordForm", () => {
  it("renders password fields when token is present", () => {
    navigationMocks.searchParams = new URLSearchParams("token=reset_token");

    render(
      <AuthEntryPage route="resetPassword">
        <ResetPasswordForm />
      </AuthEntryPage>
    );

    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update password" })
    ).toBeEnabled();
  });

  it("shows invalid token message from error query param", () => {
    navigationMocks.searchParams = new URLSearchParams("error=INVALID_TOKEN");

    render(
      <AuthEntryPage route="resetPassword">
        <ResetPasswordForm />
      </AuthEntryPage>
    );

    expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument();
  });
});
