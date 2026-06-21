import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { METADATA_SECTION_VISIBILITY_STATES } from "../contracts/section-renderer.contract.js";
import { sampleSectionFixture } from "../fixtures/sample-section.fixture.js";
import { ListSection } from "../sections/list-section.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";

describe("section rendering", () => {
  it("renders section title and description", () => {
    render(sampleSectionFixture.element);

    expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByText("Recent orders")).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="metadata-section-content"]')
    ).not.toBeNull();
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
        slots={{
          actions: <button type="button">Export</button>,
          content: <p>Orders table</p>,
          footer: <p>Updated just now</p>,
        }}
        presentation={{ chrome: "card", padded: true }}
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
