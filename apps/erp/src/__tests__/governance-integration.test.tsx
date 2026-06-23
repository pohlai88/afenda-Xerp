import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GovernanceIntegrationHarness } from "../components/governance-integration-harness";

describe("ERP governance integration harness", () => {
  it("renders AppShell and metadata surface together", () => {
    const { container } = render(<GovernanceIntegrationHarness />);

    expect(screen.getByText("Afenda ERP")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Governance integration surface" })
    ).toBeInTheDocument();
    expect(container.querySelector("[data-afenda-density]")).not.toBeNull();
    expect(container.querySelector("[data-metadata-density]")).not.toBeNull();
  });

  it("exposes required metadata and action hierarchy hooks", () => {
    const { container } = render(<GovernanceIntegrationHarness />);

    expect(
      container.querySelector('[data-metadata-state="ready"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-metadata-readonly="false"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-action-group="primary"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-action-group="secondary"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-action-group="tertiary"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-action-visibility="visible"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-action-visibility="disabled"]')
    ).not.toBeNull();
  });

  it("does not import fixture CSS in production globals", () => {
    const globals = readFileSync(
      join(import.meta.dirname, "../app/globals.css"),
      "utf8"
    );

    expect(globals).not.toContain("@afenda/metadata-ui/fixtures.css");
    expect(globals).not.toContain("@afenda/appshell/fixtures.css");
  });
});
