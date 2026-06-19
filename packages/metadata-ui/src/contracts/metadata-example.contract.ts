import type { MetadataSurfaceContract } from "./metadata-surface.contract";

export interface MetadataExampleContract {
  readonly driftWarnings: readonly string[];
  readonly name: string;
  readonly surface: MetadataSurfaceContract;
}
