import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { METADATA_SECTION_VISIBILITY_STATES } from "../contracts/section.contract.js";
import {
  sampleListSectionFixture,
  sampleListSectionOrderRows,
  sampleListSectionProps,
  sampleListSectionRenderProps,
} from "../fixtures/sample-list-section.fixture.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";
import { ListSection } from "../sections/index.js";

describe("section rendering", () => {
  it("renders enterprise list section fixture regions and sample rows", () => {
    render(sampleListSectionFixture.element);

    expect(
      screen.getByRole("region", { name: /sample orders list/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sample orders list" })
    ).toBeInTheDocument();
    expect(screen.getByText("Sample Trading Co.")).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: /sample orders for the list section fixture/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export section data" })
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-metadata-section="list"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-section-id="section.sample.orders.list"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-runtime-state="ready"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-source="static-preview"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-section-header"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-region="header"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="metadata-section-content"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-region="content"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-renderer-key="metadata-ui.section.list"]')
    ).not.toBeNull();
    expect(sampleListSectionOrderRows).toHaveLength(3);
  });

  it("exposes reusable section fixture props", () => {
    expect(sampleListSectionFixture.type).toBe("list");
    expect(sampleListSectionFixture.renderProps).toEqual(
      sampleListSectionRenderProps
    );
    expect(sampleListSectionProps.type).toBe("list");
    expect(sampleListSectionProps.presentation?.chrome).toBe("card");
    expect(sampleListSectionProps.a11y?.ariaLabelledBy).toBe(
      "section-sample-orders-list-heading"
    );
    expect(sampleListSectionProps.diagnostics?.rendererKey).toBe(
      "metadata-ui.section.list"
    );
  });

  it("renders structured section slots and accessibility metadata", () => {
    render(
      <ListSection
        a11y={{ ariaLabel: "Orders section" }}
        context={sampleRenderContext}
        identity={{
          id: "section.orders.actions",
          title: "Orders",
        }}
        presentation={{ chrome: "card", padded: true }}
        slots={{
          actions: <button type="button">Export</button>,
          content: <p>Orders table</p>,
          footer: <p>Updated just now</p>,
        }}
      />
    );

    expect(screen.getByLabelText("Orders section")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
    expect(screen.getByText("Orders table")).toBeInTheDocument();
    expect(screen.getByText("Updated just now")).toBeInTheDocument();
  });

  it("does not render hidden sections", () => {
    const { container } = render(
      <ListSection
        context={sampleRenderContext}
        identity={{ id: "section.hidden", title: "Hidden" }}
        slots={{ content: <p>Hidden content</p> }}
        state={{ visibility: "hidden", reason: "Permission denied." }}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe("METADATA_SECTION_VISIBILITY_STATES", () => {
  it("defines governed section visibility states without duplicates", () => {
    expect(METADATA_SECTION_VISIBILITY_STATES).toEqual([
      "visible",
      "hidden",
      "collapsed",
      "disabled",
    ]);
    expect(new Set(METADATA_SECTION_VISIBILITY_STATES).size).toBe(
      METADATA_SECTION_VISIBILITY_STATES.length
    );
  });
});
