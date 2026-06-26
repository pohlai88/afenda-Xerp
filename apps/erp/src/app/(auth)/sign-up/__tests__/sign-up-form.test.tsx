import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { SignUpForm } from "@/app/(auth)/_components/sign-up-form";

const signUpMocks = vi.hoisted(() => ({
  submit: vi.fn(),
}));

const navigationMocks = vi.hoisted(() => ({
  searchParams: new URLSearchParams(
    "invitationToken=invite_test&email=invited%40example.com"
  ),
}));

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
  useSearchParams: () => navigationMocks.searchParams,
}));

vi.mock("@/lib/auth/submit-invitation-sign-up.client", () => ({
  submitInvitationSignUp: signUpMocks.submit,
}));

describe("SignUpForm", () => {
  it("renders invitation sign-up fields from search params", () => {
    navigationMocks.searchParams = new URLSearchParams(
      "invitationToken=invite_test&email=invited%40example.com"
    );

    render(
      <AuthEntryPage route="signUp">
        <SignUpForm />
      </AuthEntryPage>
    );

    expect(
      screen.getByRole("heading", { name: "Create account" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("invited@example.com");
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" })
    ).toBeEnabled();
  });

  it("redirects to verify-email after successful invitation sign-up", async () => {
    navigationMocks.searchParams = new URLSearchParams(
      "invitationToken=invite_test&email=invited%40example.com"
    );
    signUpMocks.submit.mockResolvedValue({ data: {}, error: null });
    const user = setupUser();

    render(
      <AuthEntryPage route="signUp">
        <SignUpForm />
      </AuthEntryPage>
    );

    await user.type(screen.getByLabelText("Full name"), "Invited User");
    await user.type(screen.getByLabelText("Password"), "secure-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(routerMocks.replace).toHaveBeenCalledWith("/verify-email/sent");
    });
    expect(routerMocks.refresh).toHaveBeenCalledOnce();
  });

  it("shows invitation problem state when token is missing", () => {
    navigationMocks.searchParams = new URLSearchParams();

    render(
      <AuthEntryPage route="signUp">
        <SignUpForm />
      </AuthEntryPage>
    );

    expect(
      screen.getByText(/requires a valid invitation link/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Return to sign in" })
    ).toHaveAttribute("href", "/sign-in");
    expect(
      screen.queryByRole("button", { name: "Create account" })
    ).not.toBeInTheDocument();
  });
});
