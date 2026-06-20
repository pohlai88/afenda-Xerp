export const METADATA_AUTHORITY_KEYS = [
  "metadata",
  "surface",
  "layout",
  "section",
  "renderer",
  "registry",
  "presentation",
  "runtime",
] as const;

export type MetadataAuthorityKey = (typeof METADATA_AUTHORITY_KEYS)[number];

export type MetadataAuthorityOwnership =
  | "arrangement"
  | "content zones"
  | "execution context"
  | "registration"
  | "resolution"
  | "surface definitions"
  | "viewing modes"
  | "vocabulary";

export interface MetadataAuthorityDecision {
  readonly authority: MetadataAuthorityKey;
  readonly contractFile: `${MetadataAuthorityKey}.contract.ts`;
  readonly owns: MetadataAuthorityOwnership;
  readonly purpose: string;
}

export const metadataAuthorityMap = {
  metadata: {
    authority: "metadata",
    contractFile: "metadata.contract.ts",
    owns: "vocabulary",
    purpose:
      "Defines metadata identity, vocabulary, lifecycle, and governance.",
  },
  surface: {
    authority: "surface",
    contractFile: "surface.contract.ts",
    owns: "surface definitions",
    purpose: "Defines page, workspace, and module surface boundaries.",
  },
  layout: {
    authority: "layout",
    contractFile: "layout.contract.ts",
    owns: "arrangement",
    purpose: "Defines dashboard, grid, panel, stack, tabs, and wizard layouts.",
  },
  section: {
    authority: "section",
    contractFile: "section.contract.ts",
    owns: "content zones",
    purpose:
      "Defines list, stat, chart, form, detail, audit, and action sections.",
  },
  renderer: {
    authority: "renderer",
    contractFile: "renderer.contract.ts",
    owns: "resolution",
    purpose:
      "Defines renderer identity, capabilities, compatibility, and resolution rules.",
  },
  registry: {
    authority: "registry",
    contractFile: "registry.contract.ts",
    owns: "registration",
    purpose:
      "Defines registration lifecycle, governance, and registry resolution.",
  },
  presentation: {
    authority: "presentation",
    contractFile: "presentation.contract.ts",
    owns: "viewing modes",
    purpose: "Defines presentation, density, readonly, and visibility modes.",
  },
  runtime: {
    authority: "runtime",
    contractFile: "runtime.contract.ts",
    owns: "execution context",
    purpose:
      "Defines render context, execution context, runtime state, and diagnostics.",
  },
} as const satisfies Record<MetadataAuthorityKey, MetadataAuthorityDecision>;

// ─── AI Governance Rules ──────────────────────────────────────────────────────

export interface MetadataAiGovernanceRules {
  readonly may: readonly string[];
  readonly mayNot: readonly string[];
}

export const metadataAiGovernanceRules = {
  may: [
    "Consume approved metadata contracts from @afenda/metadata",
    "Generate metadata schemas from approved SURFACE_TYPES, LAYOUT_TYPES, and SECTION_TYPES",
    "Generate metadata examples that reference approved contract vocabulary",
    "Implement renderers in @afenda/metadata-ui that consume these contracts",
  ],
  mayNot: [
    "Invent new metadata authority domains",
    "Invent layout types outside LAYOUT_TYPES",
    "Invent surface types outside SURFACE_TYPES",
    "Invent section types outside SECTION_TYPES",
    "Invent registry architecture",
    "Invent runtime architecture",
    "Invent renderer governance rules",
    "Create metadata contracts in app packages or ERP domains",
    "Merge @afenda/metadata into @afenda/metadata-ui — they are separate architectural layers",
  ],
} as const satisfies MetadataAiGovernanceRules;
