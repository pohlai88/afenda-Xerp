import type {
  AppShellNavGroupWire,
  AppShellOperatingContextWire,
} from "@afenda/shadcn-studio-v2";

export const V2_PROOF_ROUTE_MARKER = "Phase 8 V2 consumer proof";

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
  description:
    "EvidenceWidget is deferred — MetricWidget stands in for Phase 8 proof.",
  label: "Evidence checkpoint",
  tone: "default" as const,
  value: "3/3",
};

export const v2ProofRequiredThemes = [
  "afenda-brand",
  "shadcn-default",
  "swiss-noir",
  "verdant-noir",
] as const;
