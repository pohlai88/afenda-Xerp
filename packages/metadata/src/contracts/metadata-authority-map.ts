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
  readonly owns: MetadataAuthorityOwnership;
  readonly contractFile: `${MetadataAuthorityKey}.contract.ts`;
  readonly purpose: string;
}

export const metadataAuthorityMap = {
  metadata: {
    authority: "metadata",
    contractFile: "metadata.contract.ts",
    owns: "vocabulary",
    purpose: "Defines metadata identity, vocabulary, lifecycle, and governance.",
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
    purpose: "Defines list, stat, chart, form, detail, audit, and action sections.",
  },
  renderer: {
    authority: "renderer",
    contractFile: "renderer.contract.ts",
    owns: "resolution",
    purpose: "Defines renderer identity, capabilities, compatibility, and resolution rules.",
  },
  registry: {
    authority: "registry",
    contractFile: "registry.contract.ts",
    owns: "registration",
    purpose: "Defines registration lifecycle, governance, and registry resolution.",
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
    purpose: "Defines render context, execution context, runtime state, and diagnostics.",
  },
} as const satisfies Record<MetadataAuthorityKey, MetadataAuthorityDecision>;
