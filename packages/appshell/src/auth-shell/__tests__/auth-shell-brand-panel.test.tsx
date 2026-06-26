import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthShellEntryBrandPanel } from "../auth-shell-brand-panel.js";

describe("AuthShellEntryBrandPanel adapter", () => {
  it("maps legacy title and description aliases into the memory gate plane", () => {
    render(
      <AuthShellEntryBrandPanel
        description="Legacy supporting copy."
        title="Legacy headline"
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: /Legacy headline/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Legacy supporting copy.")).toBeInTheDocument();
  });

  it("forwards governed plane overrides from the adapter contract", () => {
    render(
      <AuthShellEntryBrandPanel
        footerCopy="Custom footer copy."
        principles={[{ label: "Principle A", statement: "Custom principle." }]}
        readinessLabel="Custom readiness"
        readinessScore="8.8"
      />
    );

    expect(screen.getByText("Custom footer copy.")).toBeInTheDocument();
    expect(screen.getByText("Custom principle.")).toBeInTheDocument();
    expect(screen.getByLabelText("Custom readiness: 8.8")).toBeInTheDocument();
  });
});
