import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthShell, AuthShellStatusSurface } from "../auth-shell-v2.js";
import { AuthShellEntryPage } from "../auth-shell-v2-entry-layout.js";

describe("AuthShell (v2)", () => {
  it("renders lane data attribute and aria-label from title", () => {
    const { container } = render(
      <AuthShell lane="error" title="Authentication error">
        <p>Child slot</p>
      </AuthShell>
    );

    const root = container.querySelector("[data-lane='error']");
    expect(root).toBeTruthy();
    expect(root?.getAttribute("aria-label")).toBe("Authentication error");
    expect(screen.getByText("Child slot")).toBeTruthy();
  });
});

describe("AuthShellEntryPage (v2)", () => {
  it("renders lane data attribute and single h1", () => {
    const { container } = render(
      <AuthShellEntryPage lane="access" title="Sign in to Afenda">
        <p>Form slot</p>
      </AuthShellEntryPage>
    );

    expect(container.querySelector("[data-lane='access']")).toBeTruthy();
    expect(
      screen.getByRole("main", { name: "Authentication form" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in to Afenda" })
    ).toBeTruthy();
    expect(screen.getByText("Form slot")).toBeTruthy();
    expect(screen.queryAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders alternate action, escape action, and legal notice slots", () => {
    render(
      <AuthShellEntryPage
        alternateAction={<p>Alternate path</p>}
        escapeAction={<p>Escape path</p>}
        lane="recover"
        legalNotice={<p>Legal copy</p>}
        title="Reset password"
      >
        <p>Form slot</p>
      </AuthShellEntryPage>
    );

    expect(
      screen
        .getByText("Alternate path")
        .closest("[data-auth-slot='alternate-action']")
    ).toBeTruthy();
    expect(
      screen
        .getByText("Escape path")
        .closest("[data-auth-slot='escape-action']")
    ).toBeTruthy();
    expect(
      screen.getByText("Legal copy").closest("[data-auth-slot='footer']")
    ).toBeTruthy();
  });

  it("keeps a single h1 when status surface is nested in the form body", () => {
    render(
      <AuthShellEntryPage lane="verify" title="Check your inbox">
        <AuthShellStatusSurface
          description="Verification email sent."
          title="Email dispatched"
          tone="positive"
        />
      </AuthShellEntryPage>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Check your inbox" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 2, name: "Email dispatched" })
    ).toBeTruthy();
    expect(screen.queryAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
