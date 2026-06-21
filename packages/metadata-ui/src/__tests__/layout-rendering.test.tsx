import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { METADATA_LAYOUT_REGIONS } from "../contracts/layout-renderer.contract.js";
import { sampleDashboardLayoutFixture } from "../fixtures/sample-dashboard-layout.fixture.js";
import { DashboardLayout } from "../layouts/dashboard-layout.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";

describe("layout rendering", () => {
  it("renders layout content slot", () => {
    render(sampleDashboardLayoutFixture.element);

    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    expect(
      document.querySelector('[data-metadata-layout="dashboard"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-layout-content"]')
    ).not.toBeNull();
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
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
    expect(screen.getByText("Orders table")).toBeInTheDocument();
    expect(screen.getByText("Footer note")).toBeInTheDocument();
    expect(
      document.querySelector('[data-layout-label="Orders dashboard"]')
    ).not.toBeNull();
  });
});

describe("METADATA_LAYOUT_REGIONS", () => {
  it("defines governed layout regions without duplicates", () => {
    expect(METADATA_LAYOUT_REGIONS).toEqual([
      "header",
      "toolbar",
      "aside",
      "content",
      "footer",
    ]);
    expect(new Set(METADATA_LAYOUT_REGIONS).size).toBe(
      METADATA_LAYOUT_REGIONS.length
    );
  });
});
