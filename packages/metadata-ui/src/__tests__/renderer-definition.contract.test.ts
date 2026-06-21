import { describe, expect, it } from "vitest";

import {
  METADATA_RENDERER_LIFECYCLE_STATES,
  METADATA_RENDERER_RESOLVE_FAILURE_REASONS,
} from "../contracts/renderer-definition.contract.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";
import { createMetadataRendererDefinition } from "../registry/index.js";
import { listRenderer } from "../renderers/index.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("renderer definition contract", () => {
  it("defines governed renderer lifecycle states without duplicates", () => {
    expect(METADATA_RENDERER_LIFECYCLE_STATES).toEqual([
      "active",
      "experimental",
      "deprecated",
      "disabled",
    ]);
    expectUniqueValues(METADATA_RENDERER_LIFECYCLE_STATES);
  });

  it("defines governed resolve failure reasons without duplicates", () => {
    expectUniqueValues(METADATA_RENDERER_RESOLVE_FAILURE_REASONS);
  });

  it("builds structured renderer results from the canonical factory", () => {
    const result = listRenderer.render({}, sampleRenderContext);

    expect(result.node).toBeDefined();
    expect(result.diagnostics).toEqual({
      rendererKey: "metadata-ui.renderer.list.default",
      rendererVersion: "0.1.0",
      capability: "render-list",
      sectionTypes: ["list"],
    });
  });

  it("normalizes boolean supports results into structured support results", () => {
    const renderer = createMetadataRendererDefinition({
      identity: {
        key: "metadata-ui.renderer.test.supports",
        version: "0.1.0",
      },
      registry: listRenderer.governance.registry,
      capability: "render-list",
      sectionTypes: ["list"],
      supports: () => false,
      render: () => null,
    });

    expect(renderer.supports?.({}, sampleRenderContext)).toEqual({
      supported: false,
    });
  });
});
