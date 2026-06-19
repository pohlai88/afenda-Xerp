import type { MetadataSectionType } from "./metadata-section.contract";

export interface MetadataRendererContract {
  readonly id: string;
  readonly priority: number;
  readonly recipe: string;
  readonly sectionTypes: readonly MetadataSectionType[];
  readonly stable: boolean;
}

export interface MetadataRendererResolution {
  readonly reason: string;
  readonly renderer: MetadataRendererContract | null;
  readonly sectionType: MetadataSectionType;
}
