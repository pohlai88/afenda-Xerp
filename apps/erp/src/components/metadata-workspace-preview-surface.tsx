import type { MetadataUiRenderContext } from "@afenda/metadata-ui/server";
import {
  MetadataForbiddenState,
  MetadataLayout,
  MetadataPageSurface,
  MetadataSection,
  MetadataState,
  resolveMetadataPlatformIdentityDimensionLabel,
} from "@afenda/metadata-ui/server";
import { MetadataWorkspacePreviewActions } from "@/components/metadata-workspace-preview-actions.client";
import { isMetadataAuthorizationDenialPreviewContext } from "@/lib/metadata/metadata-authorization-preview.server";
import {
  METADATA_WORKSPACE_PREVIEW_SECTION_ID,
  METADATA_WORKSPACE_PREVIEW_SURFACE_ID,
  resolveMetadataWorkspacePreviewActions,
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
          <td>{resolveMetadataPlatformIdentityDimensionLabel("tenant")}</td>
          <td>{tenantDisplayName}</td>
          <td>
            <code>{context.runtime.tenantId}</code>
          </td>
        </tr>
        <tr>
          <td>
            {resolveMetadataPlatformIdentityDimensionLabel("legal_entity")}
          </td>
          <td>{companyDisplayName}</td>
          <td>
            <code>{context.runtime.companyId}</code>
          </td>
        </tr>
        <tr>
          <td>
            {resolveMetadataPlatformIdentityDimensionLabel("organization_unit")}
          </td>
          <td>{organizationDisplayName ?? "—"}</td>
          <td>{organizationId ? <code>{organizationId}</code> : "—"}</td>
        </tr>
        <tr>
          <td>{resolveMetadataPlatformIdentityDimensionLabel("workspace")}</td>
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
  const authorizationDenied =
    isMetadataAuthorizationDenialPreviewContext(context);
  const actions = resolveMetadataWorkspacePreviewActions({
    authorizationDenied,
  });

  return (
    <MetadataPageSurface
      context={context}
      diagnostics={{
        layoutRendererKey: "metadata.layout.erp-workspace-preview",
        surfaceRendererKey: authorizationDenied
          ? "metadata.surface.erp-workspace-denial-preview"
          : "metadata.surface.erp-workspace-preview",
        note: authorizationDenied
          ? "Evaluated authorization denial — verbose metadata diagnostics for policy and permission model."
          : "Production ERP metadata workspace preview — server render context only.",
      }}
      identity={{
        id: METADATA_WORKSPACE_PREVIEW_SURFACE_ID,
        title: authorizationDenied
          ? "Authorization denial preview"
          : "Metadata workspace preview",
        description: authorizationDenied
          ? "Evaluated RBAC denial rendered as a governed metadata error surface with verbose diagnostics."
          : "Governed metadata renderers composed from server-verified operating context.",
      }}
      presentation={{
        chrome: "standard",
        padded: true,
        width: "contained",
      }}
      slots={{
        toolbar: <MetadataWorkspacePreviewActions actions={actions} />,
        content: authorizationDenied ? (
          <MetadataForbiddenState
            message="Permission evaluation denied access to this workspace boundary. Review the diagnostics panel for policy decision and permission model details."
            title="Access denied"
          />
        ) : (
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
        visibility: authorizationDenied ? "readonly" : "visible",
        ...(authorizationDenied
          ? { reason: "authorization_denied" as const }
          : {}),
      }}
    />
  );
}
