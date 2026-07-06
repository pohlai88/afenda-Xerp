import type {
  AppShellNavGroupWire,
  AppShellOperatingContextWire,
  NonReadyViewSurfaceState,
} from "@afenda/shadcn-studio-v2";
import type { AuthShellState } from "@afenda/shadcn-studio-v2/clients";

export const V2_PROOF_ROUTE_MARKER = "Phase 8 V2 consumer proof";

/**
 * Lane A-08 presentation state matrix — static non-ready fixtures only (no fetch).
 *
 * | Surface          | States proved      |
 * | ---------------- | ------------------ |
 * | PageSurface      | loading, error     |
 * | MetricWidget     | empty, unavailable |
 * | EvidenceWidget   | loading, error     |
 * | DataTableSurface | empty              |
 * | FormSurface      | unavailable        |
 * | AuthShell        | loading            |
 */
export const V2_PROOF_STATE_MATRIX = [
  {
    family: "page",
    label: "PageSurface",
    states: ["loading", "error"] as const,
  },
  {
    family: "metric",
    label: "MetricWidget",
    states: ["empty", "unavailable"] as const,
  },
  {
    family: "evidence",
    label: "EvidenceWidget",
    states: ["loading", "error"] as const,
  },
  {
    family: "data-table",
    label: "DataTableSurface",
    states: ["empty"] as const,
  },
  {
    family: "form",
    label: "FormSurface",
    states: ["unavailable"] as const,
  },
  {
    family: "auth-shell",
    label: "AuthShell",
    states: ["loading"] as const,
  },
] as const;

export type V2ProofStateMatrixFamily =
  (typeof V2_PROOF_STATE_MATRIX)[number]["family"];

export interface V2ProofStateMatrixEntry {
  readonly family: V2ProofStateMatrixFamily;
  readonly state: NonReadyViewSurfaceState | AuthShellState;
}

export const v2ProofStateMatrixEntries = V2_PROOF_STATE_MATRIX.flatMap(
  (group) =>
    group.states.map((state) => ({
      family: group.family,
      state,
    }))
) satisfies readonly V2ProofStateMatrixEntry[];

export const v2ProofStateMatrixMeta = {
  description:
    "Non-ready presentation states for composed surfaces and widgets. Happy-path fixtures remain above.",
  title: "Presentation state matrix",
} as const;

export const v2ProofStateMatrixPage = {
  error: {
    description: "Static error fixture for PageSurface state regression proof.",
    title: "Page matrix — error",
  },
  loading: {
    description:
      "Static loading fixture for PageSurface state regression proof.",
    title: "Page matrix — loading",
  },
} as const;

export const v2ProofStateMatrixMetric = {
  empty: {
    description:
      "Static empty fixture for MetricWidget state regression proof.",
    label: "Metric matrix — empty",
  },
  unavailable: {
    description:
      "Static unavailable fixture for MetricWidget state regression proof.",
    label: "Metric matrix — unavailable",
  },
} as const;

export const v2ProofStateMatrixEvidence = {
  error: {
    description:
      "Static error fixture for EvidenceWidget state regression proof.",
    label: "Evidence matrix — error",
  },
  loading: {
    description:
      "Static loading fixture for EvidenceWidget state regression proof.",
    label: "Evidence matrix — loading",
  },
} as const;

export const v2ProofStateMatrixTable = {
  caption: "Empty table state — no rows rendered.",
  description:
    "Static empty fixture for DataTableSurface state regression proof.",
  title: "Table matrix — empty",
} as const;

export const v2ProofStateMatrixForm = {
  description:
    "Static unavailable fixture for FormSurface state regression proof.",
  title: "Form matrix — unavailable",
} as const;

export const v2ProofStateMatrixAuth = {
  description: "Static loading fixture for AuthShell state regression proof.",
  title: "Auth matrix — loading",
} as const;

export const v2ProofOperatingContext = {
  legalEntityLabel: "Afenda Design System Preview",
  tenantLabel: "V2 Proof Sandbox",
  workspaceLabel: "Consumer verification workspace",
} satisfies AppShellOperatingContextWire;

export const v2ProofNavGroups = [
  {
    id: "verification",
    label: "Verification",
    items: [
      {
        href: "/design-system/v2-proof",
        id: "v2-proof",
        isActive: true,
        label: "V2 proof route",
      },
    ],
  },
  {
    id: "route-lab",
    label: "Route lab",
    items: [
      {
        href: "/dashboard/sales",
        id: "sales-lab",
        isActive: false,
        label: "Sales lab",
      },
      {
        href: "/settings/appearance",
        id: "appearance-lab",
        isActive: false,
        label: "Appearance",
      },
    ],
  },
] satisfies readonly AppShellNavGroupWire[];

export const v2ProofTableFixture = {
  caption: "Static fixture rows for consumer DataTableSurface proof.",
  columns: [
    { header: "Record", id: "record" },
    { align: "end" as const, header: "Amount", id: "amount" },
    { header: "Status", id: "status" },
  ],
  description: "No business logic — presentation-only table surface.",
  rows: [
    {
      cells: { amount: "$128.00", record: "Invoice 1001", status: "Open" },
      id: "row-1",
    },
    {
      cells: { amount: "$256.00", record: "Invoice 1002", status: "Review" },
      id: "row-2",
    },
  ],
  title: "Open records",
};

export const v2ProofFormFixture = {
  description: "Consumer-owned submit wiring is intentionally omitted.",
  recordName: "Northwind replenishment",
  recordLimit: "250",
  title: "Record form",
};

export const v2ProofDialogFixture = {
  description:
    "Static confirmation surface — consumer owns open/close behavior.",
  intent: "destructive" as const,
  title: "Archive record?",
};

export const v2ProofSettingsFixture = {
  description: "Grouped settings rows with consumer-supplied controls.",
  sections: [
    {
      description: "Presentation-only workspace preferences.",
      id: "general",
      items: [
        {
          controlLabel: "Edit workspace name",
          description: "Shown in the workspace header.",
          id: "workspace-name",
          label: "Workspace name",
        },
      ],
      title: "General",
    },
  ],
  title: "Workspace settings",
};

export const v2ProofMetricFixture = {
  description: "Primary metric widget on the proof route.",
  label: "Active backlog",
  tone: "success" as const,
  value: "24",
};

export const v2ProofEvidenceFixture = {
  description: "Evidence adapter on the consumer proof route.",
  items: [
    { id: "policy", label: "Policy attestation", status: "complete" as const },
    { id: "access", label: "Access review", status: "complete" as const },
    { id: "backup", label: "Backup verification", status: "complete" as const },
  ],
  label: "Evidence checkpoint",
  summary: "3/3",
};

export const v2ProofRequiredThemes = [
  "afenda-brand",
  "shadcn-default",
  "swiss-noir",
  "verdant-noir",
] as const;

export const v2ProofAuthFixture = {
  description: "Presentation-only — no auth provider or sign-in flow wired.",
  email: "operator@example.com",
  title: "Sign in to workspace",
} as const;
