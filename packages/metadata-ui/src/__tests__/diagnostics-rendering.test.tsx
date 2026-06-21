import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createMetadataDiagnosticsSnapshot,
  MetadataDiagnosticsPanel,
  MetadataRenderTrace,
} from "../diagnostics/index.js";
import { createMetadataUiRenderContext } from "../runtime/index.js";
import {
  sampleDiagnosticsRenderContext,
  sampleDiagnosticsRuntimeContext,
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
    expect(screen.getByText("page")).toBeInTheDocument();
    expect(screen.queryByText("corr_fixture_sample_001")).toBeNull();

    rerender(
      <MetadataDiagnosticsPanel
        context={sampleRenderContext}
        snapshot={snapshot}
      />
    );

    expect(screen.queryByLabelText("Metadata diagnostics")).toBeNull();
  });

  it("shows verbose-only fields in verbose diagnostics level", () => {
    const verboseContext = createMetadataUiRenderContext({
      runtime: sampleDiagnosticsRuntimeContext,
      source: "static-preview",
      diagnosticsLevel: "verbose",
    });
    const verboseSnapshot = createMetadataDiagnosticsSnapshot(verboseContext, {
      surface: { surfaceType: "page" },
      identity: {
        actorId: "actor_preview",
      },
    });

    render(
      <MetadataDiagnosticsPanel
        context={verboseContext}
        snapshot={verboseSnapshot}
      />
    );

    expect(screen.getByText("corr_fixture_sample_001")).toBeInTheDocument();
    expect(screen.getByText("actor_preview")).toBeInTheDocument();
    expect(
      document.querySelector('[data-diagnostics-key="correlation-id"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-runtime-state="ready"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-source="static-preview"]')
    ).not.toBeNull();
  });

  it("renders structured render trace with runtime state", () => {
    const traceSnapshot = createMetadataDiagnosticsSnapshot(
      sampleDiagnosticsRenderContext,
      {
        surface: { sectionType: "stat" },
        renderer: { rendererKey: "metadata.stat-card.renderer" },
      }
    );

    render(
      <MetadataRenderTrace
        context={sampleDiagnosticsRenderContext}
        snapshot={traceSnapshot}
      />
    );

    const trace = screen.getByLabelText("Metadata render trace");
    expect(trace).toHaveTextContent(
      "metadata.stat-card.renderer → stat [ready]"
    );
    expect(trace).toHaveAttribute(
      "data-renderer-key",
      "metadata.stat-card.renderer"
    );
    expect(trace).toHaveAttribute("data-section-type", "stat");
    expect(trace).toHaveAttribute("data-runtime-state", "ready");
    expect(trace).toHaveAttribute("data-metadata-runtime-state", "ready");
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
      correlationId: "corr_fixture_sample_001",
    });
    expect(snapshot.presentation).toEqual({
      densityMode: "comfortable",
      presentationMode: "compact",
    });
    expect(snapshot.identity).toEqual({
      actorId: "actor_fixture_preview",
      tenantId: "tenant_fixture_sample",
      companyId: "company_fixture_sample",
      organizationId: "org_fixture_sample",
      workspaceId: "workspace_fixture_sample",
    });
  });

  it("builds identity from runtime context", () => {
    const context = {
      ...sampleDiagnosticsRenderContext,
      runtime: {
        ...sampleDiagnosticsRenderContext.runtime,
        actorId: "actor_001",
        tenantId: "tenant_001",
      },
    };

    const snapshot = createMetadataDiagnosticsSnapshot(context);

    expect(snapshot.identity).toEqual({
      actorId: "actor_001",
      tenantId: "tenant_001",
      companyId: "company_fixture_sample",
      organizationId: "org_fixture_sample",
      workspaceId: "workspace_fixture_sample",
    });
  });

  it("allows identity override without mutating runtime context", () => {
    const snapshot = createMetadataDiagnosticsSnapshot(
      sampleDiagnosticsRenderContext,
      {
        identity: {
          actorId: "preview_actor",
        },
      }
    );

    expect(snapshot.identity).toEqual({
      actorId: "preview_actor",
      tenantId: "tenant_fixture_sample",
      companyId: "company_fixture_sample",
      organizationId: "org_fixture_sample",
      workspaceId: "workspace_fixture_sample",
    });
  });
});
