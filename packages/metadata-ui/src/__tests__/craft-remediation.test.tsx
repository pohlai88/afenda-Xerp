import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetadataActionBar } from "../client/metadata-action-renderer.client.js";
import {
  sampleDashboardLayoutFixture,
  sampleDashboardLayoutProps,
} from "../fixtures/sample-dashboard-layout.fixture.js";
import {
  samplePageSurfaceFixture,
  samplePageSurfaceProps,
} from "../fixtures/sample-page-surface.fixture.js";
import { sampleDiagnosticsRenderContext } from "../fixtures/sample-runtime-context.fixture.js";
import { MetadataState } from "../states/metadata-state.js";

const packageRoot = join(import.meta.dirname, "../..");
const productionCss = readFileSync(
  join(packageRoot, "src/afenda-metadata-ui.css"),
  "utf8"
);
const fixturesCss = readFileSync(
  join(packageRoot, "src/fixtures/metadata-ui-fixtures.css"),
  "utf8"
);
const dashboardFixtureSource = readFileSync(
  join(packageRoot, "src/fixtures/sample-dashboard-layout.fixture.tsx"),
  "utf8"
);
const pageFixtureSource = readFileSync(
  join(packageRoot, "src/fixtures/sample-page-surface.fixture.tsx"),
  "utf8"
);
const previewCssPath = join(
  packageRoot,
  "../../apps/storybook/.storybook/preview.css"
);
const previewCss = readFileSync(previewCssPath, "utf8");

describe("metadata-ui craft remediation", () => {
  it("styles.css does not contain fixture selectors", () => {
    expect(productionCss).not.toMatch(/\.metadata-fixture-/);
  });

  it("fixtures.css contains fixture selectors", () => {
    expect(fixturesCss).toMatch(/\.metadata-fixture-dashboard-composition/);
    expect(fixturesCss).toMatch(/\.metadata-fixture-page-master-detail/);
  });

  it("production CSS exports metadata-numeric utility", () => {
    expect(productionCss).toContain(".metadata-numeric");
    expect(productionCss).toContain("font-variant-numeric: tabular-nums");
  });

  it("warns when more than one visible primary action exists", () => {
    render(
      <MetadataActionBar
        actions={[
          {
            key: "primary-a",
            label: "Primary A",
            kind: "button",
            presentation: { group: "primary", order: 1 },
          },
          {
            key: "primary-b",
            label: "Primary B",
            kind: "button",
            presentation: { group: "primary", order: 2 },
          },
        ]}
        context={sampleDiagnosticsRenderContext}
      />
    );

    expect(screen.getByText(/2 visible primary actions/i)).toBeInTheDocument();
  });

  it("renders data-action-group from presentation.group", () => {
    render(
      <MetadataActionBar
        actions={[
          {
            key: "create",
            label: "Create",
            kind: "button",
            presentation: { group: "primary" },
          },
          {
            key: "help",
            label: "Help",
            kind: "link",
            href: "/help",
            presentation: { group: "help" },
          },
        ]}
      />
    );

    expect(
      document.querySelector('[data-action-key="create"]')
    ).toHaveAttribute("data-action-group", "primary");
    expect(document.querySelector('[data-action-key="help"]')).toHaveAttribute(
      "data-action-group",
      "tertiary"
    );
  });

  it("does not apply line-through to readonly surfaces by default", () => {
    expect(productionCss).not.toMatch(
      /\[data-metadata-readonly="true"\][^{]*\{[^}]*line-through/
    );
    expect(productionCss).toMatch(
      /\.metadata-action-button:disabled[\s\S]*line-through/
    );
  });

  it("renders optional state slots when provided", () => {
    render(
      <MetadataState
        message="Try again later."
        slots={{
          action: <button type="button">Retry</button>,
          detail: <p>Correlation corr_123</p>,
          icon: <span aria-hidden="true">!</span>,
        }}
        state="error"
        title="Error"
      />
    );

    expect(
      document.querySelector('[data-slot="metadata-state-icon"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-state-action"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-state-detail"]')
    ).not.toBeNull();
  });

  it("omits state slots when not provided", () => {
    render(
      <MetadataState
        message="Loading metadata surface."
        state="loading"
        title="Loading"
      />
    );

    expect(
      document.querySelector('[data-slot="metadata-state-icon"]')
    ).toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-state-action"]')
    ).toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-state-detail"]')
    ).toBeNull();
  });

  it("dashboard fixture avoids equal 4-up KPI-only grid composition", () => {
    expect(dashboardFixtureSource).not.toContain(
      "metadata-fixture-dashboard-kpi-grid"
    );
    expect(dashboardFixtureSource).toContain(
      "metadata-fixture-dashboard-dominant-metric"
    );
    expect(dashboardFixtureSource).toContain(
      "metadata-fixture-dashboard-attention-queue"
    );

    render(sampleDashboardLayoutFixture.element);
    expect(
      document.querySelector('[data-fixture-composition="dominant-metric"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="attention-queue"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="recent-activity"]')
    ).not.toBeNull();
  });

  it("page and dashboard fixtures use different structural rhythms", () => {
    expect(pageFixtureSource).toContain("metadata-fixture-page-master-detail");
    expect(pageFixtureSource).toContain("metadata-fixture-page-audit-evidence");
    expect(pageFixtureSource).not.toContain(
      "metadata-fixture-dashboard-kpi-grid"
    );
    expect(dashboardFixtureSource).not.toContain(
      "metadata-fixture-page-master-detail"
    );

    render(samplePageSurfaceFixture.element);
    expect(
      document.querySelector('[data-fixture-composition="master-detail"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="audit-evidence"]')
    ).not.toBeNull();
    expect("toolbar" in samplePageSurfaceProps.slots).toBe(false);
    expect("toolbar" in sampleDashboardLayoutProps.slots).toBe(true);
  });

  it("Storybook preview.css loads the full globals composition + fixtures", () => {
    expect(previewCss).toContain('@import "tailwindcss"');
    expect(previewCss).toContain("@afenda/ui/afenda-ui.css");
    expect(previewCss).toContain("@afenda/appshell/afenda-appshell.css");
    expect(previewCss).toContain("@afenda/metadata-ui/afenda-metadata-ui.css");
    expect(previewCss).toContain("shadcn/tailwind.css");
    expect(previewCss).toContain(
      "packages/metadata-ui/src/fixtures/metadata-ui-fixtures.css"
    );
  });

  it("package.json exposes afenda-metadata-ui.css from src build output", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as { exports?: Record<string, unknown> };

    expect(packageJson.exports?.["./afenda-metadata-ui.css"]).toBeDefined();
    expect(existsSync(join(packageRoot, "src/afenda-metadata-ui.css"))).toBe(
      true
    );
  });
});
