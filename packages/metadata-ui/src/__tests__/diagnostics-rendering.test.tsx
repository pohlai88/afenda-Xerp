import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createMetadataDiagnosticsSnapshot } from "../diagnostics/create-metadata-diagnostics-snapshot.js";
import { MetadataDiagnosticsPanel } from "../diagnostics/metadata-diagnostics-panel.js";
import {
  sampleDiagnosticsRenderContext,
  sampleRenderContext,
} from "../fixtures/sample-runtime-context.fixture.js";

describe("diagnostics rendering", () => {
  const snapshot = createMetadataDiagnosticsSnapshot(
    sampleDiagnosticsRenderContext,
    {
      surface: { surfaceType: "page" },
    }
  );

  it("renders diagnostics only when enabled", () => {
    const { rerender } = render(
      <MetadataDiagnosticsPanel
        context={sampleDiagnosticsRenderContext}
        snapshot={snapshot}
      />
    );

    expect(screen.getByLabelText("Metadata diagnostics")).toBeInTheDocument();
    expect(screen.getByText("corr_sample_001")).toBeInTheDocument();
    expect(screen.getByText("page")).toBeInTheDocument();

    rerender(
      <MetadataDiagnosticsPanel
        context={sampleRenderContext}
        snapshot={snapshot}
      />
    );

    expect(screen.queryByLabelText("Metadata diagnostics")).toBeNull();
  });
});

describe("createMetadataDiagnosticsSnapshot", () => {
  it("builds a grouped snapshot from render context", () => {
    const snapshot = createMetadataDiagnosticsSnapshot(
      sampleDiagnosticsRenderContext,
      {
        surface: {
          surfaceType: "page",
          layoutType: "dashboard",
          sectionType: "stat",
        },
        renderer: {
          rendererKey: "metadata.stat-card.renderer",
          rendererCapability: "render-stat",
          rendererVersion: "1.0.0",
        },
      }
    );

    expect(snapshot.surface).toEqual({
      surfaceType: "page",
      layoutType: "dashboard",
      sectionType: "stat",
    });
    expect(snapshot.renderer).toEqual({
      rendererKey: "metadata.stat-card.renderer",
      rendererCapability: "render-stat",
      rendererVersion: "1.0.0",
    });
    expect(snapshot.runtime).toEqual({
      runtimeState: "ready",
      readonlyMode: false,
      diagnosticsEnabled: true,
      correlationId: "corr_sample_001",
    });
    expect(snapshot.presentation).toEqual({
      densityMode: "default",
      presentationMode: "default",
    });
    expect(snapshot.identity).toBeUndefined();
  });
});
