import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AUTH_SHELL_ERROR_TITLE_ID } from "../auth-shell.contract.js";
import { AuthShellEntryBrand } from "../auth-shell-brand.compound.js";
import { AuthShellBrandArtifactPlane } from "../auth-shell-brand-artifact-plane.client.js";
import { AuthShellEntryBrandPanel } from "../auth-shell-brand-panel.js";
import { AuthShellEntry } from "../auth-shell-entry.compound.js";
import { AuthShellError } from "../auth-shell-error.compound.js";

describe("auth-shell accessibility", () => {
  it("renders a main landmark for the sign-in column", () => {
    render(
      <AuthShellEntry.Root>
        <AuthShellEntry.FormColumn>
          <AuthShellEntry.FormInner>
            <AuthShellEntry.FormHeader
              description="Sign in with your organization credentials."
              heading="Sign in"
            />
          </AuthShellEntry.FormInner>
        </AuthShellEntry.FormColumn>
      </AuthShellEntry.Root>
    );

    const main = screen.getByRole("main", { name: "Authentication form" });
    expect(main).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in" })
    ).toBeInTheDocument();
  });

  it("wraps consumer form content in the auth-shell form body slot", () => {
    render(
      <AuthShellEntry.Root>
        <AuthShellEntry.FormColumn>
          <AuthShellEntry.FormInner>
            <AuthShellEntry.FormBody>
              <div className="erp-auth-form">Form body</div>
            </AuthShellEntry.FormBody>
          </AuthShellEntry.FormInner>
        </AuthShellEntry.FormColumn>
      </AuthShellEntry.Root>
    );

    const formBody = document.querySelector(
      ".app-shell-studio-auth-memory-gate__form-body"
    );
    expect(formBody).not.toBeNull();
    expect(formBody).toContainElement(screen.getByText("Form body"));
  });

  it("exposes the skip target with a stable id and focus target", () => {
    render(
      <AuthShellEntry.Root>
        <AuthShellEntry.SkipLink />
        <AuthShellEntry.FormColumn>
          <AuthShellEntry.FormInner>
            <AuthShellEntry.FormBody>Form body</AuthShellEntry.FormBody>
          </AuthShellEntry.FormInner>
        </AuthShellEntry.FormColumn>
      </AuthShellEntry.Root>
    );

    const skipTarget = document.getElementById("auth-shell-form");
    expect(skipTarget).not.toBeNull();
    expect(skipTarget).toHaveAttribute("tabindex", "-1");
    expect(
      screen.getByRole("link", { name: "Skip to authentication form" })
    ).toHaveAttribute("href", "#auth-shell-form");
  });

  it("groups illustration and copy inside one alert region", () => {
    render(
      <AuthShellError.Root>
        <AuthShellError.Alert>
          <AuthShellError.Illustration />
          <AuthShellError.Copy>
            <AuthShellError.Eyebrow>
              Authentication unavailable
            </AuthShellError.Eyebrow>
            <AuthShellError.Title>Service unavailable</AuthShellError.Title>
            <AuthShellError.Description>
              Authentication is temporarily unavailable. Try again in a few
              minutes.
            </AuthShellError.Description>
          </AuthShellError.Copy>
        </AuthShellError.Alert>
      </AuthShellError.Root>
    );

    expect(
      screen.getByRole("main", { name: "Authentication error" })
    ).toBeInTheDocument();
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-labelledby", AUTH_SHELL_ERROR_TITLE_ID);
    expect(alert.tagName).toBe("SECTION");
    expect(alert).toHaveTextContent("Service unavailable");
    expect(alert.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(
      screen.getByText("Authentication unavailable").closest("p")
    ).toContainElement(
      document.querySelector(
        ".app-shell-studio-auth-memory-gate__error-status-pulse"
      )
    );
  });

  it("exposes the memory gate brand environment landmark", () => {
    render(<AuthShellEntryBrandPanel />);

    expect(
      screen.getByRole("complementary", {
        name: "Afenda authentication brand environment",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Access that feels/i })
    ).toHaveAttribute("id", "auth-brand-headline");
    expect(
      screen.getByRole("region", { name: /Access that feels/i })
    ).toHaveAttribute("aria-labelledby", "auth-brand-headline");
    expect(screen.getByLabelText("Gateway readiness: 9.5")).toHaveTextContent(
      "9.5"
    );
  });

  it("renders custom principles from governed data", () => {
    render(
      <AuthShellBrandArtifactPlane
        principles={[
          { label: "Principle A", statement: "Custom lane one." },
          { label: "Principle B", statement: "Custom lane two." },
        ]}
      />
    );

    expect(screen.getByText("Custom lane one.")).toBeInTheDocument();
    expect(screen.getByText("Custom lane two.")).toBeInTheDocument();
    expect(
      screen.queryByText("One shell, every lane.")
    ).not.toBeInTheDocument();
  });

  it("keeps the artifact background slot accessible when an informative image is present", () => {
    render(
      <AuthShellEntryBrand.Background>
        <img
          alt="Manufacturing floor overview"
          src="/auth/auth-entry-preview.png"
        />
      </AuthShellEntryBrand.Background>
    );

    const artifactSlot = document.querySelector(
      ".app-shell-studio-auth-memory-gate__brand-artifact"
    );
    expect(artifactSlot).not.toBeNull();
    expect(artifactSlot).not.toHaveAttribute("aria-hidden");
    expect(
      screen.getByRole("img", { name: "Manufacturing floor overview" })
    ).toBeInTheDocument();
  });
});
