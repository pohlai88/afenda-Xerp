import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { samplePageSurfaceFixture } from "../fixtures/sample-page-surface.fixture.js";
import { MetadataModuleSurface } from "../surfaces/metadata-page-surface.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";

describe("surface rendering", () => {
  it("renders semantic surface regions", () => {
    render(samplePageSurfaceFixture.element);

    expect(
      screen.getByRole("region", { name: /orders/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Page body")).toBeInTheDocument();
  });

  it("renders module surface type", () => {
    render(
      <MetadataModuleSurface
        context={sampleRenderContext}
        id="module.inventory"
        title="Inventory"
      >
        <p>Module body</p>
      </MetadataModuleSurface>
    );

    expect(screen.getByText("Module body")).toBeInTheDocument();
    expect(
      document.querySelector('[data-metadata-surface="module"]')
    ).not.toBeNull();
  });
});
