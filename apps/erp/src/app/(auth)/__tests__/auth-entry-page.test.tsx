import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthBrandProvider } from "@/app/(auth)/_components/auth-brand-context";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";

describe("AuthEntryPage", () => {
  it("composes auth-shell without legacy auth imports", () => {
    const { container } = render(
      <AuthEntryPage route="signIn">
        <p>V2 form slot</p>
      </AuthEntryPage>
    );

    expect(container.querySelector("[data-lane='access']")).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in to Afenda ERP" })
    ).toBeTruthy();
    expect(screen.getByText("V2 form slot")).toBeTruthy();
  });

  it("renders tenant brand header when brand context is present", () => {
    const { container } = render(
      <AuthBrandProvider
        brand={{
          headline: "Welcome back to Demo Org",
          logoUrl: "https://cdn.example.com/logo.png",
          primaryColor: "#0055AA",
          productLabel: "Demo Org ERP",
          supportingText: "Secure workspace access for your team.",
        }}
      >
        <AuthEntryPage route="signIn">
          <p>V2 form slot</p>
        </AuthEntryPage>
      </AuthBrandProvider>
    );

    expect(screen.getByRole("img", { name: "Demo Org ERP logo" })).toBeTruthy();
    expect(
      container.querySelector(".af-auth-shell__brand-header")
    ).toBeTruthy();
  });
});
