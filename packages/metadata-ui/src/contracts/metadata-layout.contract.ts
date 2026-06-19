export const METADATA_LAYOUT_DENSITIES = [
  "compact",
  "standard",
  "comfortable",
] as const;

export const METADATA_LAYOUT_REGIONS = [
  "header",
  "toolbar",
  "main",
  "aside",
  "footer",
] as const;

export type MetadataLayoutDensity = (typeof METADATA_LAYOUT_DENSITIES)[number];

export type MetadataLayoutRegion = (typeof METADATA_LAYOUT_REGIONS)[number];

export interface MetadataLayoutContract {
  readonly density: MetadataLayoutDensity;
  readonly recipe: "card" | "table" | "form" | "status-state";
  readonly region: MetadataLayoutRegion;
}
