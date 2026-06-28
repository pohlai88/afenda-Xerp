import type { MetadataRenderableAction } from "@afenda/metadata-ui";

import { ACCOUNTING_READINESS_GATE_REFRESH_SUBMIT_LABEL } from "@/lib/system-admin/accounting-readiness-gate.copy.contract";

export const METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SURFACE_ID =
  "erp.system-admin.diagnostics.preview" as const;

export const METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SECTION_ID =
  "erp.system-admin.diagnostics.readiness-summary" as const;

export const METADATA_SYSTEM_ADMIN_DIAGNOSTICS_ACTIONS = [
  {
    key: "refresh-readiness-gate",
    label: ACCOUNTING_READINESS_GATE_REFRESH_SUBMIT_LABEL,
    kind: "button",
    visibility: "disabled",
    presentation: {
      group: "primary",
      order: 10,
    },
  },
] as const satisfies readonly MetadataRenderableAction[];

export function resolveSystemAdminDiagnosticsMetadataActions(input: {
  readonly sectionAccessAllowed: boolean;
}): readonly MetadataRenderableAction[] {
  return METADATA_SYSTEM_ADMIN_DIAGNOSTICS_ACTIONS.map((action) => ({
    ...action,
    visibility: input.sectionAccessAllowed ? "visible" : "disabled",
  }));
}
