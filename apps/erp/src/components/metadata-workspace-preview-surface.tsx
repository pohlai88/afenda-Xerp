import type { MetadataUiRenderContext } from "@afenda/metadata-ui/server";
import {
  MetadataForbiddenState,
  MetadataLayout,
  MetadataPageSurface,
  MetadataReadonlyState,
  MetadataSection,
  MetadataState,
  resolveMetadataPlatformIdentityDimensionLabel,
  resolveMetadataTenantHumanReferenceConceptLabel,
} from "@afenda/metadata-ui/server";
import { MetadataWorkspacePreviewActions } from "@/components/metadata-workspace-preview-actions.client";
import {
  isMetadataAuthorizationContextRequiredPreviewContext,
  isMetadataAuthorizationDenialPreviewContext,
} from "@/lib/metadata/metadata-authorization-preview.server";
import {
  METADATA_WORKSPACE_PREVIEW_SECTION_ID,
  METADATA_WORKSPACE_PREVIEW_SURFACE_ID,
  resolveMetadataWorkspacePreviewActions,
} from "@/lib/metadata/metadata-workspace-preview.contract";
import { resolveMetadataWorkspacePreviewHumanReferenceRows } from "@/lib/metadata/resolve-metadata-workspace-preview-human-reference.server";

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
            {context.runtime.tenantId ? (
              <code>{context.runtime.tenantId}</code>
            ) : (
              "—"
            )}
          </td>
        </tr>
        <tr>
          <td>
            {resolveMetadataPlatformIdentityDimensionLabel("legal_entity")}
          </td>
          <td>{companyDisplayName}</td>
          <td>
            {context.runtime.companyId ? (
              <code>{context.runtime.companyId}</code>
            ) : (
              "—"
            )}
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
            {context.runtime.workspaceId ? (
              <code>{context.runtime.workspaceId}</code>
            ) : (
              "—"
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function MetadataWorkspaceHumanReferenceTable() {
  const rows = resolveMetadataWorkspacePreviewHumanReferenceRows();

  return (
    <table>
      <caption>
        {resolveMetadataTenantHumanReferenceConceptLabel()} — live scopes parsed
        at the ERP/kernel trust boundary
      </caption>
      <thead>
        <tr>
          <th scope="col">Scope</th>
          <th scope="col">Column</th>
          <th scope="col">Wire value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.column}>
            <td>{row.scopeLabel}</td>
            <td>
              <code>{row.column}</code>
            </td>
            <td>
              <code>{row.wireValue}</code>
            </td>
          </tr>
        ))}
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
  const contextRequired =
    isMetadataAuthorizationContextRequiredPreviewContext(context);
  const actions = resolveMetadataWorkspacePreviewActions({
    authorizationDenied,
    contextRequired,
  });

  const surfaceTitle = contextRequired
    ? "Context required preview"
    : authorizationDenied
      ? "Authorization denial preview"
      : "Metadata workspace preview";

  const surfaceDescription = contextRequired
    ? "Pre-evaluation defer — select a workspace before metadata authorization can proceed."
    : authorizationDenied
      ? "Evaluated RBAC denial rendered as a governed metadata error surface with verbose diagnostics."
      : "Governed metadata renderers composed from server-verified operating context.";

  const surfaceRendererKey = contextRequired
    ? "metadata.surface.erp-workspace-context-required-preview"
    : authorizationDenied
      ? "metadata.surface.erp-workspace-denial-preview"
      : "metadata.surface.erp-workspace-preview";

  const diagnosticsNote = contextRequired
    ? "Pre-evaluation context required — defer policy with verbose metadata diagnostics."
    : authorizationDenied
      ? "Evaluated authorization denial — verbose metadata diagnostics for policy and permission model."
      : "Production ERP metadata workspace preview — server render context only.";

  return (
    <MetadataPageSurface
      context={context}
      diagnostics={{
        layoutRendererKey: "metadata.layout.erp-workspace-preview",
        surfaceRendererKey,
        note: diagnosticsNote,
      }}
      identity={{
        id: METADATA_WORKSPACE_PREVIEW_SURFACE_ID,
        title: surfaceTitle,
        description: surfaceDescription,
      }}
      presentation={{
        chrome: "standard",
        padded: true,
        width: "contained",
      }}
      slots={{
        toolbar: <MetadataWorkspacePreviewActions actions={actions} />,
        content: contextRequired ? (
          <MetadataReadonlyState
            message="Workspace tenant or legal entity context is not selected. Use Select workspace to choose an operating context, then return to this preview."
            title="Context required"
          />
        ) : authorizationDenied ? (
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
                <>
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
                  <MetadataSection
                    context={context}
                    identity={{
                      id: "erp.metadata-workspace.human-reference-boundary",
                      title: resolveMetadataTenantHumanReferenceConceptLabel(),
                      description:
                        "Metadata wire fixtures validated via kernel parse* at the ERP ingress boundary.",
                    }}
                    presentation={{
                      chrome: "card",
                      padded: true,
                    }}
                    slots={{
                      content: <MetadataWorkspaceHumanReferenceTable />,
                      footer: (
                        <MetadataState
                          message="Deferred entity scopes (employee, customer, supplier, asset, document) remain domain FDR work — fixtures show live registry columns only."
                          state="ready"
                          title="Tenant human reference boundary active"
                        />
                      ),
                    }}
                    type="list"
                  />
                </>
              ),
            }}
            type="stack"
          />
        ),
      }}
      state={{
        visibility:
          authorizationDenied || contextRequired ? "readonly" : "visible",
        ...(authorizationDenied
          ? { reason: "authorization_denied" as const }
          : contextRequired
            ? { reason: "context_required" as const }
            : {}),
      }}
    />
  );
}
