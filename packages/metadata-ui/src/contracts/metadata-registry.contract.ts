import type { MetadataRendererContract } from "./metadata-renderer.contract";
import type { MetadataSectionType } from "./metadata-section.contract";

export interface MetadataRegistryContract {
  readonly renderers: readonly MetadataRendererContract[];
  readonly sectionTypes: readonly MetadataSectionType[];
}
