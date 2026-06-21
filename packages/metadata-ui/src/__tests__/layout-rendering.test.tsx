import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { METADATA_LAYOUT_REGIONS } from "../contracts/layout.contract.js";
import {
  sampleDashboardLayoutFixture,
  sampleDashboardDominantMetric,
  sampleDashboardLayoutProps,
} from "../fixtures/sample-dashboard-layout.fixture.js";
import { DashboardLayout, TabsLayout, WizardLayout } from "../layouts/index.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";

describe("layout rendering", () => {
  it("renders asymmetric dashboard fixture regions and metrics", () => {
    render(sampleDashboardLayoutFixture.element);

    expect(
      screen.getByLabelText("Fulfillment operations")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: sampleDashboardDominantMetric.label })
    ).toBeInTheDocument();
    expect(screen.getByText("96.2%")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Attention queue" })).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: /latest fulfillment events/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Refresh operations data" })
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-fixture-region="header"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="dominant-metric"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="attention-queue"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="trend-evidence"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-layout-id="dashboard.main"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-layout="dashboard"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-renderer-key="metadata.dashboard.layout"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="dominant-metric"]')
    ).not.toBeNull();
    expect(sampleDashboardLayoutFixture.props.slots.header).not.toBeNull();
  });

  it("renders structured layout regions and accessibility metadata", () => {
    render(
      <DashboardLayout
        a11y={{ ariaLabel: "Orders dashboard" }}
        context={sampleRenderContext}
        identity={{
          id: "dashboard.orders",
          label: "Orders dashboard",
          description: "Primary orders workspace layout",
        }}
        slots={{
          header: <h2>Orders</h2>,
          toolbar: <button type="button">Filter</button>,
          aside: <nav aria-label="Sections">Nav</nav>,
          content: <p>Orders table</p>,
          footer: <p>Footer note</p>,
        }}
      />
    );

    expect(screen.getByLabelText("Orders dashboard")).toBeInTheDocument();
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
    expect(screen.getByText("Orders table")).toBeInTheDocument();
    expect(screen.getByText("Footer note")).toBeInTheDocument();
    expect(
      document.querySelector('[data-layout-label="Orders dashboard"]')
    ).not.toBeNull();
  });

  it("exposes reusable dashboard fixture props", () => {
    expect(sampleDashboardLayoutFixture.type).toBe("dashboard");
    expect(sampleDashboardLayoutProps.type).toBe("dashboard");
    expect(sampleDashboardLayoutProps.identity.id).toBe("dashboard.main");
    expect(sampleDashboardLayoutProps.presentation?.contained).toBe(true);
    expect(sampleDashboardLayoutProps.diagnostics?.rendererKey).toBe(
      "metadata.dashboard.layout"
    );
  });

  it("renders tabs and wizard layout variants with governed layout types", () => {
    const { rerender } = render(
      <TabsLayout
        context={sampleRenderContext}
        identity={{ id: "layout.tabs.sample", label: "Sample tabs layout" }}
        slots={{ content: <p>Tab panel content</p> }}
      />
    );

    expect(
      document.querySelector('[data-metadata-layout="tabs"]')
    ).not.toBeNull();
    expect(screen.getByText("Tab panel content")).toBeInTheDocument();

    rerender(
      <WizardLayout
        context={sampleRenderContext}
        identity={{ id: "layout.wizard.sample", label: "Sample wizard layout" }}
        slots={{ content: <p>Wizard step content</p> }}
      />
    );

    expect(
      document.querySelector('[data-metadata-layout="wizard"]')
    ).not.toBeNull();
    expect(screen.getByText("Wizard step content")).toBeInTheDocument();
  });
});

describe("METADATA_LAYOUT_REGIONS", () => {
  it("defines governed layout regions without duplicates", () => {
    expect(METADATA_LAYOUT_REGIONS).toEqual([
      "header",
      "toolbar",
      "body",
      "aside",
      "content",
      "footer",
    ]);
    expect(new Set(METADATA_LAYOUT_REGIONS).size).toBe(
      METADATA_LAYOUT_REGIONS.length
    );
  });
});
