import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthV2BrandProvider } from "@/app/(auth-v2)/_components/auth-v2-brand-context";
import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";

describe("AuthV2EntryPage", () => {
  it("composes auth-shell-v2 without legacy auth imports", () => {
    const { container } = render(
      <AuthV2EntryPage route="signIn">
        <p>V2 form slot</p>
      </AuthV2EntryPage>
    );

    expect(container.querySelector("[data-lane='access']")).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in to Afenda ERP" })
    ).toBeTruthy();
    expect(screen.getByText("V2 form slot")).toBeTruthy();
  });

  it("renders tenant brand panel copy when brand context is present", () => {
    render(
      <AuthV2BrandProvider
        brand={{
          headline: "Welcome back to Demo Org",
          logoUrl: "https://cdn.example.com/logo.png",
          primaryColor: "#0055AA",
          productLabel: "Demo Org ERP",
          supportingText: "Secure workspace access for your team.",
        }}
      >
        <AuthV2EntryPage route="signIn">
          <p>V2 form slot</p>
        </AuthV2EntryPage>
      </AuthV2BrandProvider>
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Welcome back to Demo Org",
      })
    ).toBeTruthy();
    expect(
      screen.getByText("Secure workspace access for your team.")
    ).toBeTruthy();
    expect(screen.getByRole("img", { name: "Demo Org ERP logo" })).toBeTruthy();
  });
});
