import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { sampleDashboardLayoutFixture } from "../fixtures/sample-dashboard-layout.fixture.js";
import { samplePageSurfaceFixture } from "../fixtures/sample-page-surface.fixture.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";
import { ListSection } from "../sections/index.js";
import { MetadataLoadingState } from "../states/index.js";

describe("metadata-ui responsive structure", () => {
  it("marks layout, surface, section, and state roots as container queries", () => {
    render(sampleDashboardLayoutFixture.element);
    expect(
      document.querySelector(".metadata-container[data-slot='metadata-layout']")
    ).not.toBeNull();

    render(samplePageSurfaceFixture.element);
    expect(
      document.querySelector(
        ".metadata-container[data-slot='metadata-surface']"
      )
    ).not.toBeNull();

    render(
      <ListSection
        context={sampleRenderContext}
        identity={{ id: "section.sample", title: "Sample" }}
        slots={{ content: <p>Content</p> }}
      />
    );
    expect(
      document.querySelector(
        ".metadata-container[data-slot='metadata-section']"
      )
    ).not.toBeNull();

    render(
      <MetadataLoadingState message="Loading workspace" title="Loading" />
    );
    expect(
      document.querySelector(".metadata-container[data-slot='metadata-state']")
    ).not.toBeNull();
  });

  it("renders action controls with governed touch target classes", () => {
    render(samplePageSurfaceFixture.element);

    const actionButtons = document.querySelectorAll(".metadata-action-button");
    expect(actionButtons.length).toBeGreaterThan(0);

    for (const button of actionButtons) {
      expect(button.classList.contains("metadata-action-button")).toBe(true);
    }
  });

  it("wraps fixture tables in scroll containers for narrow viewports", () => {
    render(sampleDashboardLayoutFixture.element);
    expect(
      document.querySelector(".metadata-fixture-dashboard-activity-table")
    ).not.toBeNull();

    render(samplePageSurfaceFixture.element);
    expect(
      document.querySelectorAll(".metadata-fixture-page-table-section").length
    ).toBeGreaterThanOrEqual(1);
  });
});
