import type { WorkspaceBoardWidgetManifest } from "../../types/views";

/**
 * Widget manifest SSOT for board-hosted adapters with dedicated `kind` rows.
 *
 * Workflow surfaces promoted in Lane B-10 — see `workflow-board-host-mapping.ts`
 * for surface → manifest kind wiring.
 */
export const workspaceBoardManifestRegistry = [
  {
    allowedDataSourceKinds: ["metric", "kpi"],
    category: "metric",
    defaultSize: { h: 2, w: 2 },
    description: "Compact numeric or text metric presentation.",
    kind: "metric",
    label: "Metric",
    minSize: { h: 2, w: 2 },
    requiredCapabilities: [],
  },
  {
    allowedDataSourceKinds: ["audit-trail", "evidence"],
    category: "evidence",
    defaultSize: { h: 3, w: 4 },
    description: "Audit or compliance evidence checkpoint summary.",
    kind: "evidence",
    label: "Evidence",
    minSize: { h: 2, w: 2 },
    requiredCapabilities: [],
  },
  {
    allowedDataSourceKinds: ["list", "table"],
    category: "table",
    defaultSize: { h: 4, w: 12 },
    description:
      "Workflow-hosted data table surface on workspace boards (ADR-0041 12x4).",
    kind: "workflow-table",
    label: "Workflow Table",
    minSize: { h: 2, w: 6 },
    requiredCapabilities: [],
  },
  {
    allowedDataSourceKinds: ["approval", "form"],
    category: "approval",
    defaultSize: { h: 3, w: 4 },
    description:
      "Workflow-hosted form surface on workspace boards (ADR-0041 card convention).",
    kind: "workflow-approval",
    label: "Workflow Approval Form",
    minSize: { h: 2, w: 3 },
    requiredCapabilities: [],
  },
] as const satisfies readonly WorkspaceBoardWidgetManifest[];

export type WorkspaceBoardManifestKind =
  (typeof workspaceBoardManifestRegistry)[number]["kind"];

export function getWorkspaceBoardManifestByKind(
  kind: string
): WorkspaceBoardWidgetManifest | undefined {
  return workspaceBoardManifestRegistry.find(
    (manifest) => manifest.kind === kind
  );
}

export function listWorkspaceBoardManifestKinds(): readonly string[] {
  return workspaceBoardManifestRegistry.map((manifest) => manifest.kind);
}
