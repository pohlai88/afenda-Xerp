import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import "@afenda/ui/afenda-ui.css";
import "@afenda/appshell/afenda-appshell.css";
import "@afenda/metadata-ui/afenda-metadata-ui.css";

import { ApplicationShell } from "@afenda/appshell";
import { createMetadataRuntimeContext } from "@afenda/metadata";
import type { MetadataRenderableAction } from "@afenda/metadata-ui";
import {
  createMetadataUiRenderContext,
  MetadataLayout,
  MetadataPageSurface,
  MetadataSection,
  MetadataState,
  metadataRuntimeDensityToGovernedDensity,
} from "@afenda/metadata-ui/server";

const STORY_RUNTIME_INPUT = {
  actorId: "actor_storybook_integration",
  tenantId: "tenant_storybook_integration",
  companyId: "company_storybook_integration",
  organizationId: "org_storybook_integration",
  workspaceId: "workspace_storybook_integration",
  correlationId: "corr_storybook_integration_001",
  permissions: ["storybook.integration.read"],
  capabilities: ["storybook.integration.view"],
  featureFlags: ["storybook.integration.enabled"],
  density: "default",
  presentationMode: "default",
  state: "ready",
  diagnosticsEnabled: true,
  readonlyMode: false,
} as const;

const STORY_RUNTIME = createMetadataRuntimeContext(STORY_RUNTIME_INPUT);

const STORY_ACTIONS = [
  {
    key: "story-primary",
    label: "Primary action",
    kind: "button",
    visibility: "visible",
    presentation: { group: "primary", order: 10 },
  },
  {
    key: "story-secondary",
    label: "Secondary action",
    kind: "button",
    visibility: "visible",
    presentation: { group: "secondary", order: 20 },
  },
  {
    key: "story-tertiary",
    label: "Tertiary action",
    kind: "link",
    href: "#story-tertiary",
    visibility: "disabled",
    presentation: { group: "tertiary", order: 30 },
  },
] as const satisfies readonly MetadataRenderableAction[];

function StoryIntegrationContent({
  readonlyMode = false,
}: {
  readonlyMode?: boolean;
}) {
  const runtime = createMetadataRuntimeContext({
    ...STORY_RUNTIME_INPUT,
    readonlyMode,
  });

  const context = createMetadataUiRenderContext({
    runtime,
    source: "static-preview",
    hydration: "none",
    diagnosticsLevel: "summary",
    diagnosticsNamespace: "storybook.integration.composed",
  });

  return (
    <MetadataPageSurface
      actions={STORY_ACTIONS}
      context={context}
      diagnostics={{
        layoutRendererKey: "metadata.layout.storybook.integration",
        surfaceRendererKey: "metadata.surface.storybook.integration",
      }}
      identity={{
        id: "storybook.integration.surface",
        title: "Composed ERP shell",
        description: "AppShell + Metadata UI with governed CSS import order.",
      }}
      presentation={{ padded: true, width: "contained", chrome: "standard" }}
      slots={{
        content: (
          <MetadataLayout
            context={context}
            identity={{
              id: "storybook.integration.layout",
              label: "Metadata layout",
            }}
            slots={{
              content: (
                <MetadataSection
                  context={context}
                  identity={{
                    id: "storybook.integration.section",
                    title: "Metadata section",
                  }}
                  slots={{
                    content: (
                      <MetadataState
                        message="Composed Storybook proof without fixture CSS."
                        state="ready"
                        title="Governance integration ready"
                      />
                    ),
                  }}
                  type="detail"
                />
              ),
            }}
            type="stack"
          />
        ),
      }}
      state={{
        visibility: readonlyMode ? "readonly" : "visible",
      }}
    />
  );
}

const meta = {
  title: "Governance/Composed ERP Shell",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composed AppShell + Metadata UI integration using approved CSS import order. Demonstrates downstream governance wiring without ERP production globals or fixture CSS in the shell chrome.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadySurface: Story = {
  render: () => (
    <ApplicationShell
      density={metadataRuntimeDensityToGovernedDensity(STORY_RUNTIME.density)}
    >
      <StoryIntegrationContent />
    </ApplicationShell>
  ),
};

export const ReadonlySurface: Story = {
  render: () => (
    <ApplicationShell
      density={metadataRuntimeDensityToGovernedDensity(STORY_RUNTIME.density)}
    >
      <StoryIntegrationContent readonlyMode />
    </ApplicationShell>
  ),
};
