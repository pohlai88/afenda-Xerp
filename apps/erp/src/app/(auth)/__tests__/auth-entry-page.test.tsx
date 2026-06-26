import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

describe("AuthEntryPage", () => {
  it("forwards route registry copy and form eyebrow to the auth shell", () => {
    render(
      <AuthEntryPage route="signIn">
        <p>Form body</p>
      </AuthEntryPage>
    );

    expect(
      screen.getByText(AUTH_ROUTE_REGISTRY.signIn.formEyebrow)
    ).toBeInTheDocument();
    expect(
      screen.getByText(AUTH_ROUTE_REGISTRY.signIn.formHeading)
    ).toBeInTheDocument();
    expect(
      screen.getByText(AUTH_ROUTE_REGISTRY.signIn.formDescription)
    ).toBeInTheDocument();
    expect(screen.getByText("Form body")).toBeInTheDocument();
  });

  it("renders ReactNode security notes in default chrome", () => {
    render(
      <AuthEntryPage
        route="forgotPassword"
        securityNote={
          <>
            For security, we do not reveal whether an account exists.{" "}
            <a href="/support">Contact support</a> if this continues.
          </>
        }
        showSecurityNote
      >
        <p>Form body</p>
      </AuthEntryPage>
    );

    expect(
      screen.getByText(
        /for security, we do not reveal whether an account exists/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Contact support" })
    ).toHaveAttribute("href", "/support");
  });
});
