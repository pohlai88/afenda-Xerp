import type { MetadataUiRenderContext } from "@afenda/metadata-ui/server";
import {
  MetadataLayout,
  MetadataPageSurface,
  MetadataSection,
  MetadataState,
} from "@afenda/metadata-ui/server";

import {
  METADATA_WORKSPACE_PREVIEW_ACTIONS,
  METADATA_WORKSPACE_PREVIEW_SECTION_ID,
  METADATA_WORKSPACE_PREVIEW_SURFACE_ID,
} from "@/lib/metadata/metadata-workspace-preview.contract";

interface MetadataWorkspacePreviewSurfaceProps {
  readonly companyDisplayName: string;
  readonly context: MetadataUiRenderContext;
  readonly organizationDisplayName: string | null;
  readonly tenantDisplayName: string;
}

function MetadataWorkspaceScopeTable({
  context,
  tenantDisplayName,
  companyDisplayName,
  organizationDisplayName,
}: MetadataWorkspacePreviewSurfaceProps) {
  const organizationId =
    context.runtime.organizationId === undefined
      ? null
      : context.runtime.organizationId;

  return (
    <table>
      <caption>
        Resolved workspace scope for this production metadata surface
      </caption>
      <thead>
        <tr>
          <th scope="col">Dimension</th>
          <th scope="col">Display</th>
          <th scope="col">Identifier</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tenant</td>
          <td>{tenantDisplayName}</td>
          <td>
            <code>{context.runtime.tenantId}</code>
          </td>
        </tr>
        <tr>
          <td>Legal entity</td>
          <td>{companyDisplayName}</td>
          <td>
            <code>{context.runtime.companyId}</code>
          </td>
        </tr>
        <tr>
          <td>Organization unit</td>
          <td>{organizationDisplayName ?? "—"}</td>
          <td>{organizationId ? <code>{organizationId}</code> : "—"}</td>
        </tr>
        <tr>
          <td>Workspace</td>
          <td>Server-resolved scope</td>
          <td>
            <code>{context.runtime.workspaceId}</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function MetadataWorkspacePreviewSurface({
  context,
  tenantDisplayName,
  companyDisplayName,
  organizationDisplayName,
}: MetadataWorkspacePreviewSurfaceProps) {
  return (
    <MetadataPageSurface
      actions={METADATA_WORKSPACE_PREVIEW_ACTIONS}
      context={context}
      diagnostics={{
        layoutRendererKey: "metadata.layout.erp-workspace-preview",
        surfaceRendererKey: "metadata.surface.erp-workspace-preview",
        note: "Production ERP metadata workspace preview — server render context only.",
      }}
      identity={{
        id: METADATA_WORKSPACE_PREVIEW_SURFACE_ID,
        title: "Metadata workspace preview",
        description:
          "Governed metadata renderers composed from server-verified operating context.",
      }}
      presentation={{
        chrome: "standard",
        padded: true,
        width: "contained",
      }}
      slots={{
        content: (
          <MetadataLayout
            context={context}
            identity={{
              id: "erp.metadata-workspace.layout.stack",
              label: "Workspace scope layout",
            }}
            slots={{
              content: (
                <MetadataSection
                  context={context}
                  identity={{
                    id: METADATA_WORKSPACE_PREVIEW_SECTION_ID,
                    title: "Resolved workspace scope",
                    description:
                      "List section renderer with production-safe HTML — no fixture CSS.",
                  }}
                  presentation={{
                    chrome: "card",
                    padded: true,
                  }}
                  slots={{
                    content: (
                      <MetadataWorkspaceScopeTable
                        companyDisplayName={companyDisplayName}
                        context={context}
                        organizationDisplayName={organizationDisplayName}
                        tenantDisplayName={tenantDisplayName}
                      />
                    ),
                    footer: (
                      <MetadataState
                        message="Static scope summary — domain data fetching remains in future module TIPs."
                        state="ready"
                        title="Production metadata wiring active"
                      />
                    ),
                  }}
                  type="list"
                />
              ),
            }}
            type="stack"
          />
        ),
      }}
      state={{
        visibility: "visible",
      }}
    />
  );
}
