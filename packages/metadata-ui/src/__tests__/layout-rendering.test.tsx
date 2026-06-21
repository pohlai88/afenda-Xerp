import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { sampleDashboardLayoutFixture } from "../fixtures/sample-dashboard-layout.fixture.js";

describe("layout rendering", () => {
  it("renders layout children", () => {
    render(sampleDashboardLayoutFixture.element);

    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    expect(
      document.querySelector('[data-metadata-layout="dashboard"]')
    ).not.toBeNull();
  });
});
