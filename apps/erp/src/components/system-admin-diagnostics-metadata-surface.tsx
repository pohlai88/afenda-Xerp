import type { MetadataUiRenderContext } from "@afenda/metadata-ui/server";
import {
  MetadataLayout,
  MetadataPageSurface,
  MetadataSection,
  MetadataState,
} from "@afenda/metadata-ui/server";

import { SystemAdminDiagnosticsMetadataActions } from "@/components/system-admin-diagnostics-metadata-actions.client";
import {
  METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SECTION_ID,
  METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SURFACE_ID,
  resolveSystemAdminDiagnosticsMetadataActions,
} from "@/lib/metadata/metadata-system-admin-diagnostics.contract";
import {
  ACCOUNTING_READINESS_GATE_OVERALL_LABELS,
  ACCOUNTING_READINESS_GATE_RUN_MODE_LABELS,
} from "@/lib/system-admin/accounting-readiness-gate.copy.contract";
import type { AccountingReadinessDiagnosticsOverallKind } from "@/lib/system-admin/resolve-accounting-readiness-gate-presentation.server";

interface SystemAdminDiagnosticsMetadataSurfaceProps {
  readonly checkedAt: string;
  readonly context: MetadataUiRenderContext;
  readonly diagnosticsOverall: AccountingReadinessDiagnosticsOverallKind;
  readonly runMode: "structure-only" | "full";
  readonly sectionAccessAllowed: boolean;
}

function SystemAdminDiagnosticsSummaryTable({
  checkedAt,
  diagnosticsOverall,
  runMode,
}: Omit<
  SystemAdminDiagnosticsMetadataSurfaceProps,
  "context" | "sectionAccessAllowed"
>) {
  const overallLabel =
    ACCOUNTING_READINESS_GATE_OVERALL_LABELS[diagnosticsOverall];
  const runModeLabel = ACCOUNTING_READINESS_GATE_RUN_MODE_LABELS[runMode];

  return (
    <table>
      <caption>Accounting readiness gate metadata bridge summary</caption>
      <thead>
        <tr>
          <th scope="col">Signal</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Overall</th>
          <td>{overallLabel}</td>
        </tr>
        <tr>
          <th scope="row">Run mode</th>
          <td>{runModeLabel}</td>
        </tr>
        <tr>
          <th scope="row">Last checked</th>
          <td>
            <time dateTime={checkedAt}>{checkedAt}</time>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function SystemAdminDiagnosticsMetadataSurface({
  checkedAt,
  context,
  diagnosticsOverall,
  runMode,
  sectionAccessAllowed,
}: SystemAdminDiagnosticsMetadataSurfaceProps) {
  const actions = resolveSystemAdminDiagnosticsMetadataActions({
    sectionAccessAllowed,
  });

  return (
    <MetadataPageSurface
      context={context}
      diagnostics={{
        layoutRendererKey: "metadata.layout.erp-system-admin-diagnostics",
        surfaceRendererKey: "metadata.surface.erp-system-admin-diagnostics",
        note: "System admin diagnostics metadata bridge — server render context with ERP adapter actions.",
      }}
      identity={{
        id: METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SURFACE_ID,
        title: "Diagnostics metadata bridge",
        description:
          "Metadata-ui surface wired through the ERP server-action adapter pattern.",
      }}
      presentation={{
        chrome: "standard",
        padded: true,
        width: "contained",
      }}
      slots={{
        toolbar: <SystemAdminDiagnosticsMetadataActions actions={actions} />,
        content: (
          <MetadataLayout
            context={context}
            identity={{
              id: "erp.system-admin.diagnostics.layout.stack",
              label: "Diagnostics metadata layout",
            }}
            slots={{
              content: (
                <MetadataSection
                  context={context}
                  identity={{
                    id: METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SECTION_ID,
                    title: "Readiness gate summary",
                    description:
                      "Live gate status projected into metadata-ui list section renderers.",
                  }}
                  presentation={{
                    chrome: "card",
                    padded: true,
                  }}
                  slots={{
                    content: (
                      <SystemAdminDiagnosticsSummaryTable
                        checkedAt={checkedAt}
                        diagnosticsOverall={diagnosticsOverall}
                        runMode={runMode}
                      />
                    ),
                    footer: (
                      <MetadataState
                        message="Refresh via metadata action bar delegates to the existing readiness gate server action."
                        state="ready"
                        title="ERP metadata action bridge active"
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
