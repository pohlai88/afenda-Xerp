import type { Meta, StoryObj } from "@storybook/react";
import {
  hierarchyActionFixtures,
  multiplePrimaryActionFixtures,
} from "./_storybook/metadata-action-bar-story.fixtures";
import { withRawStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataDarkThemeGlobals,
  metadataPaddedLayout,
  metadataStoryA11y,
} from "./_storybook/metadata-story.parameters";
import { MetadataActionBar } from "./client/metadata-action-renderer.client";
import type { MetadataDiagnosticsSnapshot } from "./contracts/diagnostics.contract";
import type { MetadataUiRenderContext } from "./contracts/render-context.contract";
import {
  MetadataBoundaryWarning,
  MetadataDiagnosticsPanel,
  MetadataRenderTrace,
} from "./diagnostics/metadata-diagnostics-panel";
import {
  sampleDiagnosticsRenderContext,
  sampleRenderContext,
  sampleVerboseDiagnosticsRenderContext,
} from "./fixtures/sample-runtime-context.fixture";

function buildDiagnosticsSnapshot(
  context: MetadataUiRenderContext,
  overrides?: Partial<
    Pick<MetadataDiagnosticsSnapshot, "surface" | "renderer" | "identity">
  >
): MetadataDiagnosticsSnapshot {
  const { runtime } = context;
  const correlationId = runtime.correlationId;
  const identity = overrides?.identity;
  const surface = overrides?.surface;
  const renderer = overrides?.renderer;
  return {
    ...(identity !== undefined && { identity }),
    ...(surface !== undefined && { surface }),
    ...(renderer !== undefined && { renderer }),
    runtime: {
      runtimeState: runtime.state,
      readonlyMode: runtime.readonlyMode,
      diagnosticsEnabled: context.diagnostics.enabled,
      ...(correlationId !== undefined && { correlationId }),
    },
    presentation: {
      densityMode: runtime.density,
      presentationMode: runtime.presentationMode,
    },
  };
}

const SUMMARY_SNAPSHOT = buildDiagnosticsSnapshot(
  sampleDiagnosticsRenderContext,
  {
    surface: { surfaceType: "page" },
    renderer: {
      rendererKey: "story.diagnostics.renderer",
      rendererVersion: "1",
    },
  }
);

const VERBOSE_SNAPSHOT = buildDiagnosticsSnapshot(
  sampleVerboseDiagnosticsRenderContext,
  {
    identity: {
      actorId: "actor_fixture_preview",
      tenantId: "tenant_fixture_sample",
      companyId: "company_fixture_sample",
      organizationId: "org_fixture_sample",
      workspaceId: "workspace_fixture_sample",
    },
    surface: { surfaceType: "page", sectionType: "list" },
    renderer: {
      rendererKey: "story.diagnostics.verbose-renderer",
      rendererCapability: "render-list",
      rendererVersion: "2",
    },
  }
);

const meta = {
  title: "Metadata/Diagnostics",
  tags: ["autodocs"],
  parameters: {
    ...metadataPaddedLayout,
    docs: {
      description: {
        component:
          "Governed diagnostics chrome from `@afenda/metadata-ui`. Panels, traces, and boundary warnings render only when `context.diagnostics.enabled` is true. Correlation IDs are safe; stack traces are never shown. Use these stories to verify structural hooks before visual styling is applied.",
      },
    },
    a11y: metadataStoryA11y,
  },
  decorators: [withRawStoryCanvas],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DiagnosticsDisabled: Story = {
  render: () => (
    <section className="metadata-section" style={{ padding: "1.5rem" }}>
      <h2 className="metadata-section-title">No diagnostics panel</h2>
      <p>
        When <code>context.diagnostics.enabled</code> is <code>false</code> all
        diagnostics components return <code>null</code>. Inspect the DOM — no{" "}
        <code>data-slot=&quot;metadata-diagnostics-panel&quot;</code> is
        present.
      </p>
      <MetadataDiagnosticsPanel
        context={sampleRenderContext}
        snapshot={buildDiagnosticsSnapshot(sampleRenderContext)}
      />
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Production context (`diagnosticsEnabled: false`) — zero diagnostics DOM output. All three diagnostics components return null.",
      },
    },
  },
};

export const DiagnosticsEnabled: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section className="metadata-section">
        <h2 className="metadata-section-title">Diagnostics summary level</h2>
        <p>
          Correlation ID:{" "}
          <code className="metadata-numeric">
            {sampleDiagnosticsRenderContext.runtime.correlationId}
          </code>{" "}
          · source: <code>static-preview</code>
        </p>
      </section>
      <MetadataDiagnosticsPanel
        context={sampleDiagnosticsRenderContext}
        snapshot={SUMMARY_SNAPSHOT}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Summary-level diagnostics — renders surface type, renderer key, runtime state, density, and presentation mode. Identity fields are hidden at summary level. No secrets or stack traces.",
      },
    },
  },
};

export const RendererTrace: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section className="metadata-section">
        <h2 className="metadata-section-title">Render trace — verbose</h2>
        <p>
          Compact one-liner trace in a{" "}
          <code>&lt;pre class=&quot;metadata-render-trace&quot;&gt;</code>:{" "}
          <em>rendererKey → sectionType [runtimeState]</em>.
        </p>
      </section>
      <MetadataRenderTrace
        context={sampleVerboseDiagnosticsRenderContext}
        snapshot={VERBOSE_SNAPSHOT}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`MetadataRenderTrace` renders `<pre class="metadata-render-trace">` with renderer key → section type [runtime state]. Only when `context.diagnostics.enabled` is true.',
      },
    },
  },
};

export const BoundaryWarning: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section className="metadata-section">
        <h2 className="metadata-section-title">Renderer boundary violation</h2>
        <p>
          Boundary warnings surface contract violations in development and
          staging. No stack traces — safe to display.
        </p>
      </section>
      <MetadataBoundaryWarning
        context={sampleDiagnosticsRenderContext}
        message="Renderer boundary violation: sectionType 'list' resolved to a renderer with incompatible capability. Expected 'render-list'."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`MetadataBoundaryWarning` emits `class="metadata-boundary-warning"` — a `border-inline-start` callout without a colour token. Suppressed in production (`diagnosticsEnabled: false`).',
      },
    },
  },
};

export const MultiplePrimaryActionWarning: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section className="metadata-section">
        <h2 className="metadata-section-title">Multiple primary actions</h2>
        <p>
          When <code>diagnostics.enabled</code> is true and more than one
          visible primary action exists, a boundary warning appears beneath the
          action bar.
        </p>
      </section>
      <MetadataActionBar
        actions={multiplePrimaryActionFixtures}
        context={sampleDiagnosticsRenderContext}
        label="Conflicting primaries"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two `group: "primary"` actions trigger the multi-primary diagnostic warning below the bar. Zero impact in production — `context.diagnostics.enabled: false`.',
      },
    },
  },
};

export const VerbosePanel: Story = {
  render: () => (
    <MetadataDiagnosticsPanel
      context={sampleVerboseDiagnosticsRenderContext}
      snapshot={VERBOSE_SNAPSHOT}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Verbose level — identity rows (actor, tenant, company, organisation, workspace) surface alongside renderer and runtime rows. Two-column grid at ≥ 32rem container width.",
      },
    },
  },
};

export const ProductionNoWarning: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section className="metadata-section">
        <h2 className="metadata-section-title">Production action bar</h2>
        <p>
          Multiple primaries, no diagnostics context — zero boundary warning
          rendered.
        </p>
      </section>
      <MetadataActionBar
        actions={multiplePrimaryActionFixtures}
        label="Multiple primaries (production)"
      />
      <section className="metadata-section">
        <h2 className="metadata-section-title">Normal hierarchy</h2>
        <p>Secondary → primary → tertiary. `data-action-group` hooks only.</p>
      </section>
      <MetadataActionBar
        actions={hierarchyActionFixtures}
        label="Fulfillment actions"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Diagnostics context omitted — no boundary warning rendered even with multiple primaries. Zero-cost production path confirmed.",
      },
    },
  },
};

export const DarkTheme: Story = {
  ...DiagnosticsEnabled,
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story:
          "Diagnostics panel under dark Afenda tokens — structural chrome only, no colour ownership.",
      },
    },
  },
};
