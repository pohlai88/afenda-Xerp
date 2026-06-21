import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetadataDiagnosticsPanel } from "../diagnostics/metadata-diagnostics-panel.js";
import {
  sampleDiagnosticsRenderContext,
  sampleRenderContext,
} from "../fixtures/sample-runtime-context.fixture.js";

describe("diagnostics rendering", () => {
  const snapshot = {
    surfaceType: "page",
    runtimeState: "ready",
    densityMode: "default",
    presentationMode: "default",
    readonlyMode: false,
    diagnosticsEnabled: true,
    correlationId: "corr_test",
  } as const;

  it("renders diagnostics only when enabled", () => {
    const { rerender } = render(
      <MetadataDiagnosticsPanel
        context={sampleDiagnosticsRenderContext}
        snapshot={snapshot}
      />
    );

    expect(screen.getByLabelText("Metadata diagnostics")).toBeInTheDocument();
    expect(screen.getByText("corr_test")).toBeInTheDocument();

    rerender(
      <MetadataDiagnosticsPanel
        context={sampleRenderContext}
        snapshot={snapshot}
      />
    );

    expect(screen.queryByLabelText("Metadata diagnostics")).toBeNull();
  });
});
