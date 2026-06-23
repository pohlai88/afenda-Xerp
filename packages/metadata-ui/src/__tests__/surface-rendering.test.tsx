import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { METADATA_SURFACE_VISIBILITY_STATES } from "../contracts/surface.contract.js";
import {
  samplePageSurfaceFixture,
  samplePageSurfaceProps,
  samplePageSurfaceRenderProps,
} from "../fixtures/sample-page-surface.fixture.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";
import { MetadataModuleSurface } from "../surfaces/index.js";

describe("surface rendering", () => {
  it("renders master-detail page surface fixture regions and actions", () => {
    render(samplePageSurfaceFixture.element);

    expect(
      screen.getByRole("region", { name: /order fulfillment queue/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Order fulfillment queue" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sales" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Refresh queue" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create order" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Fulfillment guide" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Fulfillment queue" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Audit evidence" })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Sample Trading Co.").length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("table", {
        name: /orders awaiting fulfillment action in the selected warehouse/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: /immutable events for the selected order/i,
      })
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-fixture-composition="master-detail"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-composition="detail-summary"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-surface="page"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-surface-id="page.sample.orders"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-runtime-state="ready"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-source="static-preview"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-surface-content"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-region="content"]')
    ).not.toBeNull();
    expect(
      document.querySelector(
        '[data-surface-renderer-key="metadata.surface.page"]'
      )
    ).not.toBeNull();
  });

  it("exposes reusable page surface fixture props", () => {
    expect(samplePageSurfaceFixture.type).toBe("page");
    expect(samplePageSurfaceFixture.renderProps).toEqual(
      samplePageSurfaceRenderProps
    );
    expect(samplePageSurfaceProps.type).toBe("page");
    expect(samplePageSurfaceProps.breadcrumbs).toHaveLength(3);
    expect(samplePageSurfaceProps.actions).toHaveLength(4);
    expect(samplePageSurfaceProps.actions?.[0]?.presentation?.order).toBe(10);
    expect(samplePageSurfaceProps.presentation?.width).toBe("contained");
  });

  it("renders module surface type with structured slots and actions", () => {
    render(
      <MetadataModuleSurface
        actions={[
          {
            key: "refresh",
            label: "Refresh",
            kind: "button",
          },
        ]}
        breadcrumbs={[
          { key: "inventory", label: "Inventory", href: "/inventory" },
          { key: "overview", label: "Overview" },
        ]}
        context={sampleRenderContext}
        identity={{
          id: "module.inventory",
          title: "Inventory",
        }}
        slots={{ content: <p>Module body</p> }}
        state={{ visibility: "visible" }}
      />
    );

    expect(screen.getByText("Module body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Inventory" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inventory" })).toBeInTheDocument();
    expect(
      document.querySelector('[data-metadata-surface="module"]')
    ).not.toBeNull();
  });

  it("does not render hidden surfaces", () => {
    const { container } = render(
      <MetadataModuleSurface
        context={sampleRenderContext}
        identity={{ id: "module.hidden", title: "Hidden" }}
        slots={{ content: <p>Hidden body</p> }}
        state={{ visibility: "hidden", reason: "Forbidden." }}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe("METADATA_SURFACE_VISIBILITY_STATES", () => {
  it("defines governed surface visibility states without duplicates", () => {
    expect(METADATA_SURFACE_VISIBILITY_STATES).toEqual([
      "visible",
      "hidden",
      "disabled",
      "readonly",
    ]);
    expect(new Set(METADATA_SURFACE_VISIBILITY_STATES).size).toBe(
      METADATA_SURFACE_VISIBILITY_STATES.length
    );
  });
});
