import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import { AuthStatePage } from "@/app/(auth)/_components/auth-state-page";

describe("AuthForm compound", () => {
  it("renders editorial notice variants and alternates", () => {
    const { container } = render(
      <AuthForm.Root>
        <AuthForm.NoticePositive hints={["Hint copy"]} lead="Positive lead" />
        <AuthForm.NoticeCaution hints={["Caution hint"]} lead="Caution lead" />
        <AuthForm.Alternates>
          <AuthForm.AlternateLabel>Next step</AuthForm.AlternateLabel>
          <AuthForm.AlternateNotice>Alternate action</AuthForm.AlternateNotice>
        </AuthForm.Alternates>
      </AuthForm.Root>
    );

    expect(screen.getByText("Positive lead")).toBeInTheDocument();
    expect(screen.getByText("Caution lead")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Next step")).toBeInTheDocument();
    expect(
      container.querySelector(".erp-auth-notice--positive")
    ).not.toBeNull();
    expect(container.querySelector(".erp-auth-notice--caution")).not.toBeNull();
    expect(container.querySelector(".erp-auth-status-card")).toBeNull();
  });
});

describe("AuthStatePage", () => {
  it("maps negative tone to caution notice, not positive", () => {
    const { container } = render(
      <AuthStatePage
        hints={["Try again later"]}
        lead="Session expired"
        route="sessionExpired"
        tone="negative"
      />
    );

    expect(container.querySelector(".erp-auth-notice--caution")).not.toBeNull();
    expect(container.querySelector(".erp-auth-notice--positive")).toBeNull();
  });
});
