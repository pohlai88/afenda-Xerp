"use client";

import { ApplicationShell } from "@afenda/appshell";
import type { MetadataRenderableAction } from "@afenda/metadata-ui";
import {
  createMetadataUiRenderContext,
  MetadataLayout,
  MetadataPageSurface,
  MetadataSection,
  MetadataState,
  metadataRuntimeDensityToGovernedDensity,
} from "@afenda/metadata-ui/server";
import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { createMetadataRuntimeContext } from "@afenda/ui-composition";
import { useMemo, useState } from "react";

export type GovernanceIntegrationHarnessGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

const INTEGRATION_RUNTIME_INPUT = {
  actorId: "actor_integration_harness",
  tenantId: "tenant_integration_harness",
  companyId: "company_integration_harness",
  organizationId: "org_integration_harness",
  workspaceId: "workspace_integration_harness",
  correlationId: "corr_integration_harness_001",
  permissions: ["integration.harness.read"],
  capabilities: ["integration.harness.view"],
  featureFlags: ["integration.harness.enabled"],
  density: "default",
  presentationMode: "default",
  state: "ready",
  diagnosticsEnabled: true,
  readonlyMode: false,
} as const;

const INTEGRATION_ACTIONS = [
  {
    key: "integration-primary",
    label: "Publish preview",
    kind: "button",
    visibility: "visible",
    presentation: {
      group: "primary",
      order: 10,
    },
  },
  {
    key: "integration-secondary",
    label: "Export snapshot",
    kind: "button",
    visibility: "visible",
    presentation: {
      group: "secondary",
      order: 20,
    },
  },
  {
    key: "integration-tertiary",
    label: "Open guide",
    kind: "link",
    href: "#integration-guide",
    visibility: "disabled",
    presentation: {
      group: "tertiary",
      order: 30,
    },
  },
] as const satisfies readonly MetadataRenderableAction[];

function IntegrationSectionContent({
  context,
}: {
  readonly context: ReturnType<typeof createMetadataUiRenderContext>;
}) {
  return (
    <MetadataLayout
      context={context}
      identity={{
        id: "integration.layout.workspace",
        label: "Governance integration layout",
        description:
          "Structural metadata layout composed inside AppShell without fixture CSS.",
      }}
      slots={{
        content: (
          <MetadataSection
            context={context}
            identity={{
              id: "integration.section.summary",
              title: "Ready surface",
              description:
                "Metadata UI renders governed slots, action hierarchy hooks, and runtime diagnostics.",
            }}
            slots={{
              content: (
                <MetadataState
                  message="Static integration fixture — no ERP business data, permissions, or database access."
                  state="ready"
                  title="Integration harness ready"
                />
              ),
            }}
            type="detail"
          />
        ),
      }}
      type="stack"
    />
  );
}

export function GovernanceIntegrationHarness() {
  const [readonlyMode, setReadonlyMode] = useState(false);

  const runtime = useMemo(
    () =>
      createMetadataRuntimeContext({
        ...INTEGRATION_RUNTIME_INPUT,
        readonlyMode,
      }),
    [readonlyMode]
  );

  const context = useMemo(
    () =>
      createMetadataUiRenderContext({
        runtime,
        source: "static-preview",
        hydration: "none",
        diagnosticsLevel: "summary",
        diagnosticsNamespace: "erp.integration.harness",
      }),
    [runtime]
  );

  const shellDensity = metadataRuntimeDensityToGovernedDensity(runtime.density);

  return (
    <ApplicationShell density={shellDensity}>
      <div
        className="erp-integration-harness-banner"
        data-integration-harness="true"
      >
        <p>
          <strong>Integration harness</strong> — non-production proof of
          AppShell + Metadata UI composition. Static fixtures only.
        </p>
        <Button
          aria-pressed={readonlyMode}
          emphasis="outline"
          intent="primary"
          onClick={() => {
            setReadonlyMode((current) => !current);
          }}
          presentation="default"
          size="sm"
          type="button"
        >
          {readonlyMode ? "Exit readonly preview" : "Preview readonly mode"}
        </Button>
      </div>

      <MetadataPageSurface
        actions={INTEGRATION_ACTIONS}
        context={context}
        diagnostics={{
          layoutRendererKey: "metadata.layout.integration",
          surfaceRendererKey: "metadata.surface.integration",
          note: "ERP downstream integration harness with diagnostics enabled.",
        }}
        identity={{
          id: "integration.surface.workspace",
          title: "Governance integration surface",
          description:
            "AppShell chrome wraps a metadata surface that consumes @afenda/ui-composition contracts and @afenda/ui governance.",
        }}
        presentation={{
          chrome: "standard",
          padded: true,
          width: "contained",
        }}
        slots={{
          content: <IntegrationSectionContent context={context} />,
          toolbar: (
            <div data-integration-toolbar="true">
              <Button
                emphasis="solid"
                intent="secondary"
                presentation="default"
                size="sm"
                type="button"
              >
                Governed UI control
              </Button>
            </div>
          ),
        }}
        state={{
          visibility: readonlyMode ? "readonly" : "visible",
          ...(readonlyMode
            ? { reason: "integration-readonly-preview" as const }
            : {}),
        }}
      />

      {readonlyMode ? (
        <MetadataState
          message="Readonly preview uses metadata runtime readonlyMode — editing actions remain disabled."
          state="readonly"
          title="Readonly integration section"
        />
      ) : null}
    </ApplicationShell>
  );
}
