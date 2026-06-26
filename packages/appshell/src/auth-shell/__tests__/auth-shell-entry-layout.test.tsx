import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW } from "../auth-shell.contract.js";
import { AuthShellEntryPage } from "../auth-shell-entry-layout.js";

describe("AuthShellEntryPage", () => {
  it("composes the default memory gate brand panel and form lane eyebrow", () => {
    render(
      <AuthShellEntryPage>
        <div>Form content</div>
      </AuthShellEntryPage>
    );

    expect(
      screen.getByRole("complementary", {
        name: "Afenda authentication brand environment",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW)
    ).toBeInTheDocument();
    expect(screen.getByText("Form content")).toBeInTheDocument();
  });

  it("does not render an empty form footer", () => {
    render(
      <AuthShellEntryPage formFooter={null}>
        <div>Form content</div>
      </AuthShellEntryPage>
    );

    expect(
      document.querySelector(".app-shell-studio-auth-memory-gate__form-footer")
    ).toBeNull();
  });

  it("allows a custom brand panel override", () => {
    render(
      <AuthShellEntryPage
        brandPanel={<aside aria-label="Custom brand">Custom brand</aside>}
      >
        <div>Form content</div>
      </AuthShellEntryPage>
    );

    expect(
      screen.getByRole("complementary", { name: "Custom brand" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("complementary", {
        name: "Afenda authentication brand environment",
      })
    ).not.toBeInTheDocument();
  });
});
